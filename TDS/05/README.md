### Redis  Get 명령어

Redis에서 특정 명령어를 통해서 Key를 조회 할 수 있습니다.

1. GET [key]
    1. key 값을 넣어 Value를 가져오는 명령어
    2.  해당 명령어는 O(1)의 시간 복잡도로 동작하며, 가장 빠른 방법으로 특정 key에 해당하는 Value를 가져올 수 있습니다.
2. EXISTS [key]
    1. key 값을 넣어 해당 key가 존재하는지 확인 한다. 존재하면 1 존재하지 않으면 0을 반환 합니다.
    2. 해당 명령어는 O(1)의 시간 복잡도로 동작 합니다.


### Redis 운영시 조심해야하는 명령어

1.  FLUSHALL: 이 명령어는 Redis의 모든 데이터를 즉시 삭제합니다. 사용 시 주의해야 합니다.

2.  KEYS: 이 명령어는 Redis에 저장된 모든 key를 검색하는 기능을 합니다. 이 명령어를 사용하면 데이터베이스에 저장된 데이터를 탐색하는데 시간이 많이 소요되며, 많은 리소스를 사용할 수 있습니다.

4.  SHUTDOWN 명령어는 Redis 서버를 종료하는 명령어입니다. 이 명령어를 사용하면 Redis 서버를 즉시 종료하며, 데이터베이스를 저장하는 작업을 수행하지 않은 데이터는 손실될 수 있습니다. 이 명령어는 서버를 재시작하는데 사용하는 경우를 제외하고는 사용하지 않는 것이 좋습니다. 대신 SAVE, BGSAVE, AOF(Append-only file) 등을 사용하여 데이터를 저장하는 것이 안정적입니다.

6.  CONFIG SET: 이 명령어는 Redis 설정을 변경하는 기능을 합니다. 이 명령어를 사용하여 Redis 설정을 변경하면 서비스가 중단될 수 있으므로 주의해야 합니다

8.  DEL: 특정 key를 삭제하는 명령어로, 이 명령어를 사용하면 해당 key에 해당하는 value와 관련된 모든 데이터를 삭제합니다. 삭제하려는 key를 잘못 지정하여 실수로 데이터를 삭제하는 경우를 방지하기 위해서는 주의해야 합니다.

6.  BGSAVE: Redis의 데이터를 디스크에 저장하는 명령어로, 이 명령어를 사용하면 Redis가 저장하는 데이터를 디스크에 저장하는데 시간이 오래 걸릴 수 있습니다. 이로 인해 Redis의 성능이 저하될 수 있으므로, 디스크 용량이 충분한 경우에만 사용하도록 해야 합니다.


###  웹뷰 모달 뒤로가기

사용자가 브라우저의 뒤로 버튼을 클릭할 때 모달이나 서랍을 닫는 일반적인 방법 중 하나는 이 `history.pushState`방법을 사용하는 것입니다. 이 방법을 사용하면 새 페이지로 이동하지 않고도 브라우저의 기록 스택을 업데이트하고 주소 표시줄에 표시된 URL을 변경할 수 있습니다.

`history.pushState`다음 은 사용자가 뒤로 버튼을 클릭할 때 모달 또는 서랍을 닫는 데 사용할 수 있는 방법의 예입니다 .


```javascript
import { useEffect } from 'react';

function MyComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const unblock = history.block((location, action) => {
            if (action === 'POP' && isModalOpen) {
                setIsModalOpen(false);
                return false;
            }
            return true;
        });
        return () => {
            unblock();
        }
    }, [isModalOpen]);

    const handleOpenModal = () => {
        history.pushState(null, null, '/my-modal');
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        history.goBack();
    }

    return (
        <>
            <button onClick={handleOpenModal}>Open Modal</button>
            {isModalOpen && (
                <div>
                    <button onClick={handleCloseModal}>Close Modal</button>
                    <p>Modal Content</p>
                </div>
            )}
        </>
    );
}

```

이 예제에서 `handleOpenModal`메서드는 사용자가 "Open Modal" 버튼을 클릭할 때 호출되며 현재 URL이 '/my-modal'인 브라우저의 기록 스택에 새 상태를 푸시하고 모달을 엽니다. 그런 다음 `handleCloseModal`사용자가


### nslookup 명령어
nslookup 명령어는 Domain Name System (DNS) 정보를 조회합니다.

언제 사용: 도메인 이름에 대한 IP 주소, MX 레코드, NS 레코드 등의 DNS 정보를 확인할 때 사용합니다.
어떤 상황에서 쓰면 좋은지: 네트워크 설정을 확인하거나, 도메인 이름에 대한 DNS 정보를 확인할 때 유용합니다.

```
nslookup google.com
nslookup google.com 8.8.8.8
```
도메인 google.com이랑 연결된 IP주소를 반환합니다.


### Microsoft Azure Virtual Training Day - 1

클라우드 유형 비교
- 공용 클라우드
   - 확장 시 자본 지출 필요하지 않음
   - 사용하는 만큼 비용을 지불합니다.
- 사설 클라우드
   - 직접 시작하고 유지관리를 위해 헤드웨어를 구입 해야합니다.
   - 조직에서 직접 리소스 보안 제어가 가능하다

클라우드 이점
1. 고가용성(high availability)
2. 내결함성
3. 확장성
4. 탄력성( Auto 개념) 자동으로 고무줄 처럼 늘렸다 줄였다. 할 수 있음
5. 민첩성
6. 글로벌 지원
7. 응답 속도
8. 예측가능 비용

azure는 구독이 있어야 리소스 만들 수가 있다
과금은 구독 리소스를 기준으로 계산된다.

관리 그룹을 통화 구독을 관리할 수 있다.


### pm2 + nextjs  웹서버 띄우기

다음은 Next.js 앱을 시작하고 프로세스를 관리하기 위한 몇 가지 일반적인 PM2 명령입니다.

1.  Next.js 앱을 시작합니다.

`pm2 start npm --name "app-name" -- start`

2.  프로세스 중지:

`pm2 stop app-name`

3.  프로세스를 다시 시작합니다.

`pm2 restart app-name`

4.  실행 중인 프로세스 나열:

`pm2 list`

5.  프로세스 로그 모니터링:

`pm2 logs app-name`

6.  프로세스 제거:

`pm2 delete app-name`

7.  프로세스 정보 표시:

`pm2 show app-name`

참고: "app-name"을 실제 앱 이름으로 바꾸십시오.


### pm2 환경 설정
1.  다음 명령을 사용하여 시스템에 전역적으로 PM2를 설치합니다.

코드 복사

`npm install pm2 -g`

2.  다음 명령으로 PM2를 사용하여 Node.js 애플리케이션을 시작합니다.

`pm2 start <your_app_script>`

3.  서버를 다시 시작한 후 Node.js 애플리케이션이 자동으로 시작되도록 하려면 다음 명령을 사용할 수 있습니다.

`pm2 save`

4.  애플리케이션 상태를 모니터링하려면 다음 명령을 사용할 수 있습니다.

`pm2 monit`

5.  PM2에서 생성된 로그를 보려면 다음 명령을 사용할 수 있습니다.

`pm2 logs`

6.  애플리케이션을 다시 시작하려면 다음 명령을 사용할 수 있습니다.

`pm2 restart <your_app_script>`

7.  애플리케이션을 중지하려면 다음 명령을 사용할 수 있습니다.

`pm2 stop <your_app_script>`

참고: `<your_app_script>`Node.js 애플리케이션의 실제 스크립트 파일 이름으로 바꾸십시오.

프로덕션 환경의 경우 클러스터 모드에서 PM2를 실행하는 것이 좋습니다. 들어오는 요청을 여러 작업자 프로세스 간에 분산하여 애플리케이션의 성능을 향상시킬 수 있기 때문입니다. 다음 명령을 사용하여 클러스터 모드에서 애플리케이션을 실행할 수 있습니다.

`pm2 start <your_app_script> -i <number_of_instances>`

`<number_of_instances>`원하는 수의 작업자 프로세스로 교체하십시오 .

###  pm2 클러스터 설정

M2 클러스터 모드 설정 방법:

1.  PM2 설치:

`npm install pm2 -g`

2.  애플리케이션 파일에서 PM2를 통해 애플리케이션 실행:

`pm2 start app.js -i max`

-   `-i max`옵션은 최대로 설정할 수 있는 옵션입니다.

PM2 촬영 방법:

1.  PM2촬영:

`pm2 monit`

2.  PM2 관리자 대시보드 확인:

`pm2 dashboard`

PM2 환경설정에 대한 추천:

1.  애플리케이션 이전 PM2의 프로세스 상태 저장:

`pm2 save`

2.  농구 후 PM2 애플리케이션 자동 시작:

`pm2 startup`

3.  PM2 고정 설정:

`pm2 logrotate -u <user_name>`

4.  PM2 관리자 대시보드 설정:

`pm2 install pm2-web`

PM2 사진 촬영 방법:

1.  PM2촬영:

`pm2 monit`

2.  PM2 클러스터 상태 확인:

`pm2 show <app_name>`

3.  PM2 상태 그래프:

`pm2 show <app_name> --graph`
