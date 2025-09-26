import { useEffect, useState } from "react";

import { Button, Card, Col, Container, Modal, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/config";
import axios from "axios";

/**
 * step 01
 * 단순히 모든 상품 목록을 상품 아이디 역순으로 리스트 표시
 * 하나의 행에 3열씩 출력
 * 필드 검색과 페이징 기능은 구현하지 않았음
 */

/**
 * step 02
 * 사용자 정보가 'ADMIN'이면, 등록/수정/삭제 버튼이 보이게
 * 삭제 버튼에 대한 기능 구현
 */

function App(props) {
    // Spring에서 넘겨 받은 상품 목록 State
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);                    // 모달 열림/닫힘 상태
    const [selectedItem, setSelectedItem] = useState(null);     // 선택된 상품

    const navigate = useNavigate();

    // SpringBoot에 "상품 목록"을 요청
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`;

        axios
            .get(url, {})
            .then((response) => { setProducts(response.data); })
            .catch((error) => {console.log(error)});
    }, []);

    const handleShow = (item) => {
        setSelectedItem(item);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedItem(null);
    };

    const handelDelete = async (id, name) => {
        const isDelete = window.confirm(`'${name}' 상품을 삭제 하시겠습니까?`);

        if(!isDelete) {
            alert(`'${name}' 상품 삭제를 취소하셨습니다.`);
            return;
        }
        
        try { // 상품 삭제 후 다시 상품 목록 페이지
            // 주의) 상품을 삭제하려면 반드시 primary key 인 상품의 아이디를 넘겨주어야 함
            await axios.delete(`${API_BASE_URL}/product/delete/${id}`);
            alert(`'${name}' 상품 삭제 되었습니다.`);
            // state에서 바로 제거 (리렌더링 발생)
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
        } catch (error) {
            console.log(error);
            alert(`상품 삭제 실패 : ${error.response?.data || error.message}`);
        }
    }

    // 관리자 모드일 때 뜨는 '수정', '삭제' 버튼을 생성
    const makeAdminButtons = (item) => {
        if(props.user?.role !== 'ADMIN') return null;

        return (
            <div className="d-flex justify-content-center">
                <Button
                    variant="warning" 
                    className="mb-2" 
                    size="sm"
                    onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/product/update/${item.id}`);
                    }}
                >
                    수정
                </Button>
                &nbsp;
                <Button
                    variant="danger" 
                    className="mb-2" 
                    size="sm"
                    onClick={(event) => {
                        event.stopPropagation();
                        handelDelete(item.id, item.name)
                        }}>
                    삭제
                </Button>
            </div>
        );
    }


    return(
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>
            <Link to={`/product/insert`}>
                {props.user?.role === 'ADMIN' && (
                    <Button variant="primary" className="mb-3">상품 등록</Button>
                )}
            </Link>

            {/* 필드 검색 영역 */}
            
            {/* 상품 목록 자료 영역 */}
            <Row>
                {/* products는 상품 배열, item은 상품 1개를 의미 */}
                {products.map((item) => (
                    <Col key={item.id} md={4} className="mb-4" >
                        {/** onClick={() => handleShow(item)} */}
                        <Card className="h-100" onClick={() => navigate(`/product/detail/${item.id}`)} 
                            style={{cursor:'pointer'}} >
                            <Card.Img 
                                variant="top" 
                                src={`${API_BASE_URL}/images/${item.image}`}
                                alt={item.name} 
                                style={{width:'100%', height:'200px'}} />
                            <Card.Body>
                                {/* borderCollapse : 각 셀의 테두리를 합칠 것인지 (collapse), 분리할것인지 (separate) */}
                                <Table style={{width:'100%', borderCollapse:'collapse', border:'none'}}>
                                    <tbody>
                                        <tr>
                                            <td style={{width:'70%', padding:'4px', border:'none'}}>
                                                <Card.Title>{item.name}({item.id})</Card.Title>
                                            </td>
                                            {/* textAlign: 수평 정렬 방식, verticalAlign: 수직 정렬 방식 */}
                                            {/* rowSpan 속성은 세로방향으로 병합 ↔ colSpan 가로 */}
                                            <td rowSpan={2} style={{padding:'4px', border:'none', textAlign:'center', verticalAlign:'middle'}}>
                                                {makeAdminButtons(item)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{width:'70%', padding:'4px', border:'none'}}>
                                                <Card.Text>가격 : {item.price.toLocaleString()}원</Card.Text>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {/* 모달 */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{selectedItem?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {selectedItem && (
                    <>
                        <p><b>번호:</b> {selectedItem.id}</p>
                        <p><b>가격:</b> {selectedItem.price.toLocaleString()}원</p>
                        <p><b>카테고리:</b> {selectedItem.category}</p>
                        <p><b>재고:</b> {selectedItem.stock}</p>
                        <p><b>내용:</b> {selectedItem.description}</p>
                        <img
                            src={`${API_BASE_URL}/images/${selectedItem.image}`}
                            alt={selectedItem.name}
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        />
                    </>
                )}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>닫기</Button>
                </Modal.Footer>
            </Modal>

            {/* 페이징 처리 영역 */}

        </Container>
    );
}

export default App;