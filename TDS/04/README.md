### pnpm 패키지 매니저로 monorepo 구성해보기

1. pnpm을 설치합니다. `npm install -g pnpm`
2.  Monorepo 프로젝트를 생성합니다.
3.  프로젝트 루트에 `pnpm init`명령어로 패키지를 생성합니다.
4.  프로젝트 루트에 `pnpm workspace create <workspace-name>`명령어로 워크스페이스를 생성합니다.
5.  워크스페이스에 패키지를 추가합니다. `pnpm add <package-name> --workspace-root=<workspace-name>`
6.  워크스페이스에 있는 패키지를 사용하려면 `pnpx <workspace-name> <command>`명령어를 사용합니다.
7.  패키지를 추가, 제거, 업데이트 할 때는 `pnpm add/remove/update <package-name> --workspace-root=<workspace-name>`명령어를 사용합니다.

>Pnpm은 npm와 yarn과 같은 package manager 이며, monorepo구성에서는 패키지 관리를 효율적으로 관리 할 수 있도록 도와줍니다

### Lerna + pnpm 사용하여 monorepo 구성 하기



