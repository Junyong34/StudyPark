

## 2023-10-04


- [x] 🛫 2023-10-04  🔼  PC 경우 상단 fixed 수정 ✅ 2023-10-05
- [x] 🛫 2023-10-05 🔼  필터 상품 리스트 3개씩 노출( sort  type 수정) ✅ 2023-10-05
- [x] 🛫 2023-10-05 🔼 more 화면 body 깨짐 수정 ✅ 2023-10-05
- [x] 🛫 2023-10-05 🔼  주류 리스트 8개 이상 2row 수정 ✅ 2023-10-05
- [ ] 🛫 2023-10-06 🔼  검색 -> 검색필터 fiex
- [ ] 🛫 2023-10-12  MYPAGE 관련 PATH --> MYPAGE_PATH로 전부 변경
- [ ] 🛫 2023-10-12  MYPAGE 관련 화면 PC인 경우 classname 수정
- [ ] 🛫 2023-10-12  MYPAGE_MAIN 은 PC랑 Mobile 2가지 화면 존재  분기 처리 필요 ! 마이페이지로 이동하는 버튼마다

AS353NB3A, AS353NG3A,AS353NS3A

340,200

```javascript
import React from 'react';  
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
function App() {  
  return (  
    <Router>  
      <div className="App">  
        <nav>  
          <ul>  
            <li>  
              <Link to="/mypage">My Page</Link>  
            </li>  
          </ul>  
        </nav>      
          <Switch>  
          <Route path="/mypage" component={MyPage} />  
        </Switch>  
      </div>  
    </Router>  
  );  
}function MyPage(props) {  
  return (  
    <div>  
      <div className="left-sidebar">  
        <ul>  
          <li>  
            <Link to="/mypage/order">Order</Link>  
          </li>  
          <li>  
            <Link to="/mypage/point">Point</Link>  
          </li>  
          <li>  
            <Link to="/mypage/coupon">Coupon</Link>  
          </li>  
        </ul>  
      </div>  
      <div className="contents">  
        <Switch>  
          <Route path="/mypage/order" component={Order} />  
          <Route path="/mypage/point" component={Point} />  
          <Route path="/mypage/coupon" component={Coupon} />  
        </Switch>  
      </div>  
    </div>  
  );  
}function Order(props) {  
  return (  
    <div>  
      {/* Order 페이지의 내용을 여기에 추가하세요 */}  
    </div>  
  );  
}function Point(props) {  
  return (  
    <div>  
      {/* Point 페이지의 내용을 여기에 추가하세요 */}  
    </div>  
  );  
}function Coupon(props) {  
  return (  
    <div>  
      {/* Coupon 페이지의 내용을 여기에 추가하세요 */}  
    </div>  
  );  
}export default App;
```


