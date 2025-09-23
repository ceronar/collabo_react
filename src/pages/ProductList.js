import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import axios from "axios";

/**
 * step 01
 * 단순히 모든 상품 목록을 상품 아이디 역순으로 리스트 표시
 * 하나의 행에 3열씩 출력
 * 필드 검색과 페이징 기능은 구현하지 않았음
 */

function App(props) {
    // Spring에서 넘겨 받은 상품 목록 State
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);                    // 모달 열림/닫힘 상태
    const [selectedItem, setSelectedItem] = useState(null);     // 선택된 상품

    // SpringBoot에 "상품 목록"을 요청
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`;

        axios
            .get(url, {})
            .then((response) => { setProducts(response.data); })
            .catch(() => {});
    }, []);

    const handleShow = (item) => {
        setSelectedItem(item);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedItem(null);
    };

    return(
        <Container className="my-4">
            <h1 className="my-4">상품 목록 페이지</h1>

            {/* 필드 검색 영역 */}

            {/* 상품 목록 자료 영역 */}
            <Row>
                {/* products는 상품 배열, item은 상품 1개를 의미 */}
                {products.map((item) => (
                    <Col key={item.id} md={4} className="mb-4" >
                        <Card className="h-100" style={{cursor:'pointer'}} onClick={() => handleShow(item)}>
                            <Card.Img 
                                variant="top" 
                                src={`${API_BASE_URL}/images/${item.image}`}
                                alt={item.name} 
                                style={{width:'100%', height:'200px'}} />
                            <Card.Body>
                                <Card.Title>{item.name}({item.id})</Card.Title>
                                <Card.Text>가격 : {item.price.toLocaleString()}원</Card.Text>
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