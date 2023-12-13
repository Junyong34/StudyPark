
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