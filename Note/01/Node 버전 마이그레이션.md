
node_option 추가
- 노드 옵션 조회 명렁어
	- ```echo $NODE_OPTIONS```
- 환경변수 설정
	- `NODE_OPTIONS` 환경 변수를 설정하여 특정 Node.js 옵션을 변경할 수 있습니다. OpenSSL 관련 설정이 문제인 경우, 다음과 같이 시도해보세요.
	-  ```export NODE_OPTIONS="--openssl-legacy-provider"```
-  npm 재설치 
	-  ```rm -rf node_modules```
	- `rm package-lock.json`
	-  `npm cache clear --force`
	- `npm install`


core-js 설치
![[Pasted image 20231213093919.png]]

KB 제휴 
- PC 서비스 종료
- Mobile은 계약은 되어있지만 작업이 안되어있는 상황

신한 (확인)
- PC 하고 있음
- Mobile 제휴예정

삼성 (확인)
- PC만 제휴
- Mobile 제휴예정