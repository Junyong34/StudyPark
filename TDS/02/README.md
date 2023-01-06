
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
