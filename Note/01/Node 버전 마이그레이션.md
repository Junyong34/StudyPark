
## openSSL
- Nodejs 버전  업데이트로 legacy 버전 충돌로 인해 강제적인 install 처리
	- npm install --legacy-peer-deps
node_option 추가
- 노드 옵션 조회 명렁어
	- ```echo $NODE_OPTIONS```
- 환경변수 설정
	- `NODE_OPTIONS` 환경 변수를 설정하여 특정 Node.js 옵션을 변경할 수 있습니다. OpenSSL 관련 설정이 문제인 경우, 다음과 같이 시도해보세요.
	-  ```export NODE_OPTIONS="--openssl-legacy-provider"```
 ```c
 
Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:68:19)
    at Object.createHash (node:crypto:138:10)
    at module.exports (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/NormalModule.js:471:10)
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/NormalModule.js:503:5
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/NormalModule.js:358:12
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at iterateNormalLoaders (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/loader-runner/lib/LoaderRunner.js:221:10)
/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/react-scripts/scripts/start.js:19
  throw err;
  ^

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:68:19)
    at Object.createHash (node:crypto:138:10)
    at module.exports (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/NormalModule.js:417:16)
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/NormalModule.js:452:10
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/webpack/lib/NormalModule.js:323:13
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/loader-runner/lib/LoaderRunner.js:367:11
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/loader-runner/lib/LoaderRunner.js:233:18
    at context.callback (/Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at /Users/junni34/workspace/homeplusW/mfront-web/src/main/front-app/node_modules/babel-loader/lib/index.js:59:103 {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}


```

해당 설정은 Node.js에서 OpenSSL 모듈을 레거시(Legacy) 프로바이더로 사용하도록 설정하는 것입니다.

OpenSSL은 보안 통신을 위해 사용되는 오픈 소스 라이브러리입니다. 레거시 프로바이더는 이전 버전의 OpenSSL에서 사용되던 프로바이더이며, 최신 버전의 OpenSSL에서는 비활성화되어 있습니다.

따라서, 이 설정은 오래된 OpenSSL 버전과의 호환성을 유지하기 위해 사용됩니다. 예를 들어, 이전에 작성된 코드나 라이브러리가 최신 버전의 OpenSSL에서 작동하지 않는 경우 이 설정을 사용하여 문제를 해결할 수 있습니다.

이 설정은 다음과 같이 명령행에서 export 명령을 사용하여 설정할 수 있습니다.


`export NODE_OPTIONS="--openssl-legacy-provider"`

이 설정을 적용하면, 이후에 실행되는 Node.js 프로세스는 레거시 프로바이더를 사용하게 됩니다.

하지만, 이 설정은 보안적인 측면에서 최신 버전의 OpenSSL을 사용하는 것보다 취약할 수 있으므로, 가능하면 최신 버전의 OpenSSL을 사용하는 것이 좋습니다. 또한, 이 설정을 사용하는 경우에도 코드나 라이브러리를 최신 버전으로 업데이트하는 것이 좋습니다.


## npm 재설치 
	-  ```rm -rf node_modules```
	- `rm package-lock.json`
	-  `npm cache clear --force`
	- `npm install`


## core-js 설치

Cannot find module: 'core-js/modules/es.array.unscopables.flat'. Make sure this package is installed.

You can install this package by running: npm install core-js/modules/es.array.unscopables.flat.

![[Pasted image 20231213093919.png]]

## npm install , npm ci
- `npm install core-js --legacy-peer-deps`
- `npm install  --legacy-peer-deps`
- `npm install ci --legacy-peer-deps`


## node type 버전
- @types/node **12.12.47**. --> **20.10.0**


## webStorm Node interpreter 설정 변경



KB 제휴 
- PC 서비스 종료
- Mobile은 계약은 되어있지만 작업이 안되어있는 상황

신한 (확인)
- PC 하고 있음
- Mobile 제휴예정

삼성 (확인)
- PC만 제휴
- Mobile 제휴예정
-


```json
{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-scrollbar-width:thin;-moz-scrollbar-width:thin;-ms-scrollbar-width:thin;scrollbar-width:thin;white-space:nowrap;overflow-x:auto;overflow-scrolling:touch;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-overflow-style:none;
}
```