import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import FruitOne from "../pages/FruitOne";
import FruitList from "../pages/FruitList";
import ElementOne from "../pages/ElementOne";
import ElementList from "../pages/ElementList";

// 이 파일은 라우팅 정보를 담고있는 파일
// 이러한 파일을 네트워크에서는 routing table
function App() {
    return(
        <Routes>
            {/* path 프롭스는 요청 정보 url, element 프롭스는 컴포넌트 이름 */}
            <Route path='/' element={<HomePage />} />
            <Route path='/member/signup' element={<SignupPage />} />
            {/* <Route path='/member/login' element={<LoginPage />} /> */}
            <Route path='/fruit' element={<FruitOne />} />
            <Route path='/fruit/list' element={<FruitList />} />
            <Route path='/element' element={<ElementOne />} />
            <Route path='/element/list' element={<ElementList />} />
        </Routes>
    );
}

export default App;