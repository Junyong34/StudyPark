### pnpm 패키지 매니저로 monorepo 구성해보기

1. pnpm을 설치합니다. `npm install -g pnpm`
2.  Monorepo 프로젝트를 생성합니다.
3.  프로젝트 루트에 `pnpm init`명령어로 패키지를 생성합니다.
4.  프로젝트 루트에 `pnpm workspace create <workspace-name>`명령어로 워크스페이스를 생성합니다.
5.  워크스페이스에 패키지를 추가합니다. `pnpm add <package-name> --workspace-root=<workspace-name>`
6.  워크스페이스에 있는 패키지를 사용하려면 `pnpx <workspace-name> <command>`명령어를 사용합니다.
7.  패키지를 추가, 제거, 업데이트 할 때는 `pnpm add/remove/update <package-name> --workspace-root=<workspace-name>`명령어를 사용합니다.

>Pnpm은 npm와 yarn과 같은 package manager 이며, monorepo구성에서는 패키지 관리를 효율적으로 관리 할 수 있도록 도와줍니다

***

### Lerna + pnpm 사용하여 monorepo 구성 하기

1.  먼저, pnpm을 설치합니다. `npm install -g pnpm`
2.  Monorepo 프로젝트를 생성합니다.
3.  프로젝트 루트에서 lerna를 설치합니다. `pnpm add -D lerna`
4.  프로젝트 루트에서 lerna를 초기화합니다. `pnpx lerna init`
5.  프로젝트 루트에서 패키지를 추가합니다. `pnpx lerna create <package-name>`
6.  패키지를 추가할 때는 lerna를 사용합니다. `pnpx lerna add <package-name> <package-directory>`
7.  패키지를 업데이트, 제거할 때도 lerna를 사용합니다. `pnpx lerna update <package-name>`, `pnpx lerna remove <package-name>`
8.  패키지를 배포할 때는 lerna를 사용합니다. `pnpx lerna publish`


이처럼 pnpm + lerna를 사용하면, 패키지 관리, 배포, 의존성 관리 등을 쉽게 관리할 수 있습니다.


### 모노레포 관리 명령어


1.  `lerna bootstrap` : 모든 패키지간의 의존성을 설치하고 연결합니다.
2.  `lerna list` : 모든 패키지 목록을 표시합니다.
3.  `lerna clean` : 모든 패키지에서 node_modules 디렉토리를 삭제합니다.
4.  `lerna exec` : 모든 패키지에서 명령
    1. lerna exec -- rm -rf ./node_modules : workspace 하위 node_modules 전부 삭제
5.  `lerna run` : 모든 패키지에서 npm script를 실행합니다.
6.  `lerna import` : 외부 패키지를 현재 모노레포로 가져옵니다.
7.  `lerna create` : 새로운 패키지를 생성합니다.
8.  `lerna add` : 패키지에 의존성을 추가합니다.
9.  `lerna remove` : 패키지에서 의존성을 제거합니다.
10.  `lerna updated` : 업데이트된 패키지를 목록으로 보여줍니다.
11.  `lerna version` : 패키지 버전을 업데이트 합니다.
12. `lerna publish`: 명령어는 lerna를 사용해 패키지를 배포할 때 사용하는 명령어 입니다.

이 명령어를 사용하면 패키지의 버전을 업데이트 하고, 이를 기반으로 패키지를 배포합니다.

배포 전 패키지의 버전을 업데이트 할 때 `lerna version` 명령어를 사용할 수 있으며, 이때 `--force-publish` 옵션을 사용하면 버전을 강제로 업데이트 할 수 있다.

버전 업데이트 후 `lerna publish` 명령어를 사용하면, 패키지를 배포할 수 있다.

배포시 `--skip-npm`,`--skip-git` 옵션을 사용하면 NPM, git 에 배포하지 않는다.

옵션을 추가하여 배포할때는 `lerna publish <version> --exact` 를 사용하면 버전을 정확히 지정해 배포할 수 있다.

`lerna publish` 명령어를 사용하면 패키지를 쉽게 배포 할 수 있다.
