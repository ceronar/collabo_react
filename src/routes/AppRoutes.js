import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";

import ProductList from "../pages/ProductList"
import ProductInsertForm from "../pages/ProductInsertForm"

import FruitOne from "../pages/FruitOne";
import FruitList from "../pages/FruitList";
import ElementOne from "../pages/ElementOne";
import ElementList from "../pages/ElementList";

// 이 파일은 라우팅 정보를 담고있는 파일
// 이러한 파일을 네트워크에서는 routing table
function App(props) {
    // props.user : 사용자 정보를 저장하고 있는 객체
    // props.handleLoginSuccess : 로그인 성공시 동작할 액션
    return(
        <Routes>
            {/* path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
            <Route path='/' element={<HomePage />} />
            <Route path='/member/signup' element={<SignupPage />} />
            <Route path='/member/login' element={<LoginPage setUser={props.handleLoginSuccess} />} />

            {/* 로그인 여부에 따라서 상품 목록 페이지가 다르게 보여야 하므로, user props를 넘겨줌 */}
            <Route path='/product/list' element={<ProductList user={props.user} />} />
            <Route path='/product/insert' element={<ProductInsertForm />} />

            <Route path='/fruit' element={<FruitOne />} />
            <Route path='/fruit/list' element={<FruitList />} />
            <Route path='/element' element={<ElementOne />} />
            <Route path='/element/list' element={<ElementList />} />
        </Routes>
    );
}

export default App;