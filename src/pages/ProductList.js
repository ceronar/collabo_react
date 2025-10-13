import { useEffect, useState } from "react";

import { Button, Card, Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
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
    // const [show, setShow] = useState(false);                    // 모달 열림/닫힘 상태
    // const [selectedItem, setSelectedItem] = useState(null);     // 선택된 상품

    // 페이징과 관련된 state 정의
    const [paging, setPaging] = useState({
        totalElements : 0, //전체 데이터 개수(165개)
        pageSize : 6, // 1페이지에 보여 주는 데이터 개수(6개)
        totalPages : 0, // 전체 페이지 개수(28페이지)
        pageNumber : 0, // 현재 페이지 번호(20페이지)
        pageCount : 10, // 페이지 하단 버튼의 개수(10개)
        beginPage : 0, // 페이징 시작 번호 
        endPage : 0, // 페이징 끝 번호
        pagingStatus : '', // "pageNumber/totalPages 페이지"
        // 자바의 SearchDto 연관 필드(field)
        searchDateType : 'all', // 기간 검색 콤보 박스
        category : '', // 검색하고자 하는 특정 카테고리 콤보 박스
        searchMode : '', // 상품 검색 모드 콤보 박스 | 상품이름(name) or 상품설명(description)
        searchKeyword : '' // 검색 키워드 입력 상자
    });

    const navigate = useNavigate();

    // SpringBoot에 "상품 목록"을 요청
    useEffect(() => {
        const url = `${API_BASE_URL}/product/list`;
        const parameters = {
            params : {
                pageNumber : paging.pageNumber,
                pageSize : paging.pageSize,
                searchDateType : paging.searchDateType,
                category : paging.category,
                searchMode : paging.searchMode,
                searchKeyword : paging.searchKeyword
            },
            withCredntials: true
        };

        axios
            .get(url, parameters)
            .then((response) => { 
                console.log(response.data);
                setProducts(response.data.content || []); 

                // 사용자가 pagination 항목을 클릭하여 페이징 정보를 업데이트
                // 주의) 0base이므로 코드 작성에 유의
                setPaging((previous) => {
                    const totalElements = response.data.totalElements;
                    const totalPages = response.data.totalPages;
                    const pageNumber = response.data.pageable.pageNumber;
                    // pageSize의 값은 고정적이라면 할당 받지 않아도 됨
                    // 단, 가변적인 경우 할당
                    const pageSize = response.data.pageable.pageSize;

                    const pageCount = 10; // 고정값

                    const beginPage = Math.floor(pageNumber/pageCount)*pageCount;
                    const endPage = Math.min((beginPage+pageCount-1), (totalPages - 1));

                    // 주의) 0base 이므로 +1을 해주어야 한다
                    const pagingStatus = `${pageNumber+1}/${totalPages} 페이지`;

                    return {
                        ...previous,
                        totalElements : totalElements,
                        totalPages : totalPages,
                        pageNumber : pageNumber,
                        pageSize : pageSize,
                        beginPage : beginPage,
                        endPage : endPage,
                        pagingStatus : pagingStatus
                    };
                });
            })
            .catch((error) => {console.log(error)});
    }, [paging.pageNumber, paging.searchDateType, paging.category, paging.searchMode, paging.searchKeyword]);

    /* 
    const handleShow = (item) => {
        setSelectedItem(item);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedItem(null);
    };
    */

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
            <Form className="p-3">
                <Row className="mb-3">
                    {/* 검색 기간 선택 */}
                    <Col md={2}>
                        <Form.Select 
                            name="searchDateType" 
                            value={paging.searchDateType}
                            onChange={(e) => setPaging((previous) => ({ ...previous, searchDateType:e.target.value }))} 
                        >
                            <option value='all'>전체 기간</option>
                            <option value='1d'>1일</option>
                            <option value='1w'>1주</option>
                            <option value='1m'>1개월</option>
                            <option value='6m'>6개월</option>
                        </Form.Select>
                    </Col>

                    {/* 카테고리 선택 */}
                    <Col md={2}>
                        <Form.Select 
                            name="category" 
                            value={paging.category}
                            onChange={(e) => setPaging((previous) => ({ ...previous, category:e.target.value }))} 
                        >
                            <option value='ALL'>카테고리 선택</option>
                            <option value='BREAD'>빵</option>
                            <option value='BEVERAGE'>음료수</option>
                            <option value='CAKE'>케이크</option>
                        </Form.Select>
                    </Col>

                    {/* 검색 모드 선택 */}
                    <Col md={2}>
                        <Form.Select 
                            name="searchMode" 
                            value={paging.searchMode}
                            onChange={(e) => setPaging((previous) => ({ ...previous, searchMode:e.target.value }))} 
                        >
                            <option value='ALL'>검색 선택</option>
                            <option value='name'>상품명</option>
                            <option value='description'>상품 설명</option>
                        </Form.Select>
                    </Col>

                    {/* 검색어 입력란 */}
                    <Col md={4}>
                        <Form.Control 
                            name="searchKeyword"
                            type="text"
                            placeholder="검색어를 입력해 주세요."
                            value={paging.searchKeyword}
                            onChange={(e) => {
                                e.preventDefault();
                                setPaging((previous) => ({ ...previous, searchKeyword:e.target.value }));
                            }}
                        />
                    </Col>

                    {/* 페이징 상태 */}
                    <Col md={2}>
                        <Form.Control 
                            as="input"
                            type="text"
                            value={paging.pagingStatus}
                            disabled
                            style={{
                                fontSize: '18px',
                                backgroundColor: '#f0f0f0',
                                textAlign: 'center', // 텍스트 가운데 정렬
                                width: '100%', // 필요한 너비 설정
                                margin: '0 auto', // 가운데 정렬을 위한 자동 여백
                            }}
                        />
                    </Col>
                </Row>
            </Form>
            
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

            {/* 페이징 처리 영역 */}
            <Pagination className="justify-content-center mt-4">
                {/* 앞쪽 영역 */}
                <Pagination.First
                    onClick={() => {
                        console.log('First 버튼 클릭(0페이지 이동)');
                        setPaging((previous)=>({...previous, pageNumber:0}));
                    }}
                    disabled={paging.pageNumber === 0}
                    as="button"
                >
                    처음
                </Pagination.First>
                <Pagination.Prev
                    onClick={() => {
                        const gotoPage = paging.beginPage - 1;
                        console.log(`Prev 버튼 클릭(${gotoPage}페이지 이동)`);
                        setPaging((previous)=>({...previous, pageNumber:gotoPage}));
                    }}
                    disabled={(paging.beginPage - 1) < 0}
                    as="button"
                >
                    이전
                </Pagination.Prev>

                {/* 숫자 링크가 들어가는 영역 */}
                {[...Array(paging.endPage - paging.beginPage + 1)].map((_, idx) => {
                    // pageIndex는 숫자 링크 번호
                    const pageIndex = paging.beginPage + idx + 1;

                    return(
                        <Pagination.Item
                            key={pageIndex}
                            active={paging.pageNumber === (pageIndex - 1)}
                            onClick={() => {
                                console.log(`${pageIndex-1}페이지 이동`);
                                setPaging((previous)=>({...previous, pageNumber:(pageIndex-1)}));
                            }}
                        >
                            {pageIndex}
                        </Pagination.Item>
                    );
                })}
                

                {/* 뒤쪽 영역 */}
                <Pagination.Next
                    onClick={() => {
                        const gotoPage = paging.endPage + 1;
                        console.log(`Next 버튼 클릭(${gotoPage}페이지 이동)`);
                        setPaging((previous)=>({...previous, pageNumber:gotoPage}));
                    }}
                    disabled={(paging.endPage + 1) > (paging.totalPages - 1)}
                    as="button"
                >
                    다음
                </Pagination.Next>
                <Pagination.Last
                    onClick={() => {
                        const gotoPage = paging.totalPages - 1;
                        console.log(`Last 버튼 클릭(${gotoPage}페이지 이동)`);
                        setPaging((previous)=>({...previous, pageNumber:gotoPage}));
                    }}
                    disabled={paging.pageNumber === (paging.totalPages - 1)}
                    as="button"
                >
                    마지막
                </Pagination.Last>
            </Pagination>


            {/* 모달 
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
            */}
        </Container>
    );
}

export default App;