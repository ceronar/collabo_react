import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
// useNavigate 혹은 특정한 페이지로 이동하고자 할 때 사용되는 훅
import { useNavigate } from "react-router-dom";


function App(props) {
    const navigate = useNavigate();

    // user 프롭스를 사용하여 상단에 보이는 풀다운 메뉴를 적절히 분기 처리
    const renderMenu = () => {
        /*  
            props.user?.role : 자바스크립트의 optional chaining 문법
            props.user이 null이면 undefined로 변환하고 오류 메세지를 별도로 반환X
        */
        switch(props.user?.role) {
            case 'ADMIN':
                return(
                    <>
                        <Nav.Link onClick={() => navigate(`/product/insert`)}>상품 등록</Nav.Link>
                        <Nav.Link onClick={props.handleLogout}>로그아웃</Nav.Link>
                    </>
                );
            case 'USER':
                return(
                    <>
                        <Nav.Link onClick={() => navigate(`/`)}>장바구니</Nav.Link>
                        <Nav.Link onClick={() => navigate(`/`)}>주문내역</Nav.Link>
                        <Nav.Link onClick={props.handleLogout}>로그아웃</Nav.Link>
                    </>
                );
            default:
                return(
                    <>
                        <Nav.Link onClick={() => navigate(`/member/login`)}>로그인</Nav.Link>
                        <Nav.Link onClick={() => navigate(`/member/signup`)}>회원 가입</Nav.Link>
                    </>
                );
        }
    };

    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#" onClick={() => navigate(-1)}><strong>&lt;&nbsp;</strong></Navbar.Brand>
                <Navbar.Brand href='/'>{props.appName}</Navbar.Brand>
                <Nav className="me-auto">
                    {/* 하이퍼링크 : Nav.Link는 다른 페이지로 이동할 때 사용됩니다.  */}
                    <Nav.Link onClick={() => navigate(`/product/list`)}>상품 보기</Nav.Link>
                    {/* user에 따른 분기된 메뉴 rendering */}
                    {renderMenu()}
                    <NavDropdown title={`기본 연습`}>
                        <NavDropdown.Item onClick={() => navigate(`/fruit`)}>과일 1개</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/fruit/list`)}>과일 목록</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/element`)}>품목 1개</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => navigate(`/element/list`)}>품목 여러개</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default App;