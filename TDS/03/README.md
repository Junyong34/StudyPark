### WebView  meta Tag 정리


> reference URL [meta tag][https://github.com/Lutece/HEAD#recommended-minimum]



**최소 권장 사항**

```html
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 위의 3 가지 메타 태그는 *반드시* head 내에 먼저 있어야합니다. 다른 head 내용은 이 태그 *뒤에* 와야합니다. -->
<title>Page Title</title>
```


**zoom content**

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1, user-scalable=0">
```


head meta tag에 속성을 부여 한다.
1. `maximum-scale=1.0 `: 1배 Zoom in 한다
2. `minimum-scale=1.0` :  1배 zoom out 한다.
3. `user-scalable=0` : 사용자가 double touch 나 pinch-to-zoom을 못하게 막는다.

**width=device-width**
- 모바일 페이지 사이즈 최적화

**select 안되게 막기**

```css
* {
	user-select: none;
}
```
`user-select` 를 이용한다면  double click OR selection drag  이용하여 글자를 선택하는 것을 막을 수 있다.

`user-select: auto | all | none | text` 총 4개의 값을 사용할 수 있다.

-   `auto` : default 값으로 브라우저 허용 시 텍스트 선택 가능
-   `all` : 더블클릭이 아닌 클릭만으로도 선택이 가능
-   `none` : 텍스트 선택이 안됨
-   `text` : 텍스트 선택이 가능


**새로고침 N초 후 다른 사이트로 이동 기능**
```html
<meta http-equiv="refresh" content="3; url=http://www.naver.com/" />
```

새로 고침을 하면 3초 뒤에 url로 지정한 사이트로 이동 한다.


**URL 링크 공유시 스니펫 일부로 사용**
```html
<!-- 페이지에 대한 간단한 설명 (최대 150 자) -->
<!-- *일부 상황*에서는 이 설명이 검색 결과에 표시된 스니펫의 일부로 사용됩니다. -->
<meta name="description" content="A description of the page">
```

### ESLint, Prettier 셋팅
```bash
# eslint와 prettier
$ pnpm add -D eslint prettier

# eslint의 formatter을 off하고 prettier를 사용하기 위한 패키지들
$ pnpm add -D eslint-config-prettier eslint-plugin-prettier

# typescript를 lint하기 위한 패키지들
$ pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser

# next 규칙 플러그인
$ pnpm add -D @next/eslint-plugin-next

# airbnb 규칙
$ pnpm add -D eslint-config-airbnb

# airbnb 규칙의 의존성 패키지들
$ pnpm add -D eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks

# airbnb 타입스크립트 규칙
$ pnpm add -D eslint-config-airbnb-typescript

# jest를 규칙 플러그인
$ pnpm add -D eslint-plugin-jest
```
