

- /even/refresh
	- 이벤트 정보를 읽어다가 새로 스케줄 생성
- /event/stop
	- 이벤트 알람 멈춤
- /event/start
	- 이벤트 알람 시작

이벤트 스케줄 6개 등록 되었습니다.
이벤트 스케줄 6개 제거 되었ㅅ브니다.


서버 init flow
1. express 기동
2. router 연결
3. lowdb 연결
4. API 호출하여 결과 값 lowdb 전송
완료


모바일 API를 사용하다보니 반응형[PC] 개발시 데이터가 추가적으로 필요함 중계에서 해결이 안되는 부분은
BO에 요청하여 데이터를 추가로 받아야 합니다.

