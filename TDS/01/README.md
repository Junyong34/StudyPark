
### 터널링

리눅스 터널링은 컴퓨터 네트워크 기술의 한 종류로, 원격 컴퓨터에 있는 자원을 로컬 컴퓨터에서 사용할 수 있도록 해주는 기술입니다. 일반적으로 리눅스 터널링은 원격 컴퓨터에 있는 자원을 직접 접근할 수 없는 경우, 예를 들어 원격 컴퓨터가 방화벽으로 인해 외부에서 접근할 수 없거나, 원격 컴퓨터에 있는 자원을 익명으로 사용하고 싶은 경우에 사용된다.

* * *

### Session 과 Cookie

WAS에서 생성한 Session 같은 도메인에서는 유지가 되다가 결제 모듈로 페이지 전환이 일어나는 경우 세션이 사라지는 현상이 발생 했다. 결제 모듈만 다녀오면, 로그인이 풀려버리는... 그래서 이것 저것 정보를 찾다보니 2020년 2월에 크롬에서 새로운 쿠키가 적용되면서 쿠기에  sameSite 기본 값이 `None` 에서 `Lax`로 변경 되었다고 한다.

`SameSite` 속성은 서로 다른 도메인에서 쿠기 전송에 대한 보안을 설정하는 옵션이다.
- `None`는 서로 다른 도메인끼리 쿠키 전송이 가능하다.
- `Strict`는 서로 다른 도메인에서는 쿠키 전송이 불가능하다. 
- `Lax`는 Strict 정책에서 몇가지 예외처리가 추가된 정책이다. (Lax에서 GET 요청은 허용한다.)

즉 백앤드에서 `cookieserializer`를 통해 SameSite 옵션을 None 주었다. 
> None 경우 반드시 Https 프로토콜에서 쿠기 Secure 속성을 사용해야한다.
> Secure true를 주지 않으면 요청 header에서 경고 마크를 볼 수 있다.

Secure 옵션은 https 통신을 수행하는 경우에만 쿠키를 전송하는 옵션이다.
즉,  Cookie의 Secure 설정은 쿠키가 전송될 때 암호화된 채널을 통해 전송되도록 하는 설정이다.
Secure 설정이 적용된 쿠키는 암호화된 채널을 통해 전송되기 때문에, 전송과정에서 인터셉트되거나 정보가 유출될 위험이 낮아 진다.

SameSite, Secure 설정을 통해 결제 이후에도 세션이 유지가 되도록 처리 했다.

* * *

### 리눅스 명령어

오랜만에 리눅스에 접속을 하게 되면 명령어가 너무 기억이 안나서.. 오늘 사용한 명령어를 적어본다.

보안 파일 복사
- scp  -i  key.pem   [복사 대상 파일 ]   name@host:/[복사 되는 위치]

 현재 디렉터리 파일 삭제
- rm -rf  * 

 압축해제
 - unzip [압축파일]

 특정 키워드 검색
 - grep -i jun sever.log


***


### Nginx를 사용하여 로드밸런싱 테스트

N대에 WAS 앞에 Nginx를 셋팅하여 다른 WAS에 연결 하더라도, Session이 끊어지지 않는지 테스트를
하기위에 구축하기로 했다.

Nginx에서 라운드로빈을 설정하여 WAS를 A -> B  , B -> A   동일하게 변경 시키면 어떻게 될까
Redis Session 작업을 하지 않고 실행 했을 때,  로그인을 하더라도 세션이 사라져서 로그인이 풀리는 현상 발생
Redis를 구축하고 테스트를 하니 로그인이 계속 유지되는걸 확인 할 수 있었다.

간단하게 테스트 해보기위해 mac 환경에 Docker를 이용하여 구축 하였다.

**DokcerFile**
```javascript
FROM nginx:alpine  
  
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
```

**Nginx 설정**

nginx.conf
```java
upstream origin {  
        server 192.168.0.1:8082;  
        server 192.168.0.2:8083;  
    }  
  
server {  
   listen 80;  
   #listen         443 ssl;  
    location / {  
       proxy_pass http://origin;  
        proxy_set_header X-Real-IP $remote_addr;  
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
        proxy_set_header Host $http_host;  
    }  
  
}
```

nginx는 3가지 로드 밸런싱 옵션이 있다.
1.  round-robin: 라운드 로빈방식으로 서버를 할당
2.  least-connected: 커넥션이 가장 적은 서버를 할당
3.  ip-hash: 클라이언트 IP를 해쉬한 값을 기반으로 특정 서버를 할당

아무 설정을 하지 않으면 기본 값이 round-robin 방식이다.

upstream에 2개 WAS를 설정 했다.

* * *

WAS 2대를 Docker를 올려보자

<B>dockerFile</B>

```dockerfile
FROM tomcat:7-jdk8  
RUN apt-get update  
RUN apt-get install -y tzdata  
ENV TZ=Asia/Seoul  
  
CMD ["catalina.sh", "run"]
```

tomcat WAS를 셋팅하고

**docker-compose.yml**

```yaml
version: "3"  
  
services:  
  choroc:  
    container_name: web-app-test1  
    build: .  
    environment:  
      - TZ=Asia/Seoul  
    volumes:  
      - ./webapp:/usr/local/tomcat/webapps/web-app-test  
      - ./conf/server.xml:/usr/local/tomcat/conf/server.xml  
    ports:  
      - 8443:8443  
      - 8082:8082
```

```yaml
version: "3"  
  
services:  
  choroc:  
    container_name: web-app-test2  
    build: .  
    environment:  
      - TZ=Asia/Seoul  
    volumes:  
      - ./webapp:/usr/local/tomcat/webapps/web-app-test  
      - ./conf/server.xml:/usr/local/tomcat/conf/server.xml  
    ports:  
      - 8443:8443  
      - 8082:8082
```

2개 컨테이너를 생성 시킨다.

volumes 마운트를 통해서 소스 변경을 간편하게 셋팅을 한다.

명령어
- docker compose up --build
    - 빌드를 하고 컨테이너를 실행한다.
- docker compose down  or docker compose up
    - volumes에 소스 파일을 변경하면서 up / down 실행한다.


***




