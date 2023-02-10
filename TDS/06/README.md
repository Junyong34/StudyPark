### Redis Lua 스크립트

Redis로 Session를 관리하도록 변경하고 2주 정도 지났다.  메트릭 데이터를 보기위해 Azure 인사이트 메뉴에 들어가서 메트릭정보를 모니터링 했다. 별 문제는 없어 보였는데 session이 만료 되면서
`spring:session:index:org.springframework.session.FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME`  key가 2만개 정도 쌓여 있었다.

TTL 시간을 조회 해봤는데 -1 값이 들어가 있었다. 세션이 만료되면 이력을 남기위해서 삭제가 되지 않고 key가 누적 되는거 같았다. java에서 session 관련 코드를 추가하기 전에 해당 데이터를 날려보려고 이것 저것 검색을 하는 와중에 redis에서 lua라는 스크립트를 활용해서 삭제하는 방법을 알게 되었다.

```bash
redis-cli keys "spring:session:index:org.springframework.session.FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME*" | wc -l

```

해당 명령어로 몇개 key가 있는지 조회가 가능하다.

저 키를 기반으로 lua 스크립트를 작성했다.

```bash
local keys = redis.call("KEYS", "spring:session:index:org.springframework.session.FindByIndexNameSessionRepository.PRINCIPAL_NAME_INDEX_NAME*")  
for i, key in ipairs(keys) do  
    if redis.call("TTL", key) == -1 then  
        redis.call("DEL", key)  
    endend
```

해당 키 개수 많큼 for문을 돌면서 해당 key값이 -1 (만료) 된 key만 삭제하는 lua 스크립트를 작성 했다.

해당 lua 스크립트는 따로 SHA로 저장해서 사용할 수도 있었고, 1번만 사용도 가능 했다.
> lua 버전마다 작동하는 명령어가 다르니 버전을 확인 해야한다.

```bash
redis-cli -p 6379 -h redis-choroc-devops-dev-kc-002.redis.cache.windows.net -a keyfile= EVAL "$(cat delete-redis-session-key.lua)" 0
 
```

EVAL "$(cat delete-redis-session-key.lua)" 0  
cli 명령어 뒤에 EVAL를 추가해서 스크립트를 실행 시켰다.


