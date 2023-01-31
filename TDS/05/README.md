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
