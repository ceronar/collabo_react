import axios from "axios";

import { useEffect, useState } from "react";
import { Button, Container, Table, Form, Row, Col, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config/config";


function App(props) {
    const thStyle = { fontSize: '1.2rem' }; // 테이블 헤더 스타일

    // 보여주고자 하는 '카트 상품' 배열 정보
    const [cartProducts, setCartProducts] = useState([]);

    // 화면에 보여주는 주문 총 금액을 위한 스테이트
    const [orderTotalPrice, setOrderTotalPrice] = useState(0);

    const navigate = useNavigate();

    // 사용자의 정보가 바뀔 때 화면을 렌더링
    // props.user?.id : Optional Chaining
    // (물음표를 적어 주면 값이 없어도 오류가 발생하지 않고 undefined를 반환)
    // 즉, 오류화면을 보여 주지 않고 마저 동작함
    useEffect(() => {
        if(props.user && props.user?.id){
            fetchCartProducts();
        }
    }, [props.user]);

    // 특정 고객이 장바구니에 담은 '카트 상품' 목록을 조회
    const fetchCartProducts = async () => {
        try {
            const url = `${API_BASE_URL}/cart/list/${props.user.id}`;
            const response = await axios.get(url);
            console.log('상품 카트 조회 결과');
            console.log(response.data);

            setCartProducts(response.data || []);

        } catch (error) {
            console.log('오류 정보');
            console.log(error);
            alert('장바구니를 추가 해주세요');
            navigate('/product/list');
        }
    };

    // 전체 선택 체크 박스를 Toggle시
    const toggleAllCheckBox = (isAllCheck) => {
        // isAllCheck : 전체 선택 체크 박스의 boolean 값
        setCartProducts((previous) => {
            // 모든 객체(카트 상품)들의 나머지 속성은 보존하고, 체크 상태(checked)를 
            // '전체 선택' 체크 상태와 동일하게 설정
            const updatedProducts = previous.map((product) => ({
                ...product,
                checked: isAllCheck
            }));

            // 비동기식 렌더링 문제로 수정된 updatedProducts 항목을 매개 변수로 넘겨야 정상적으로 동작
            refreshOrderTotalPrice(updatedProducts);

            return updatedProducts;
        });
    };

    // 체크 박스의 상태가 Toggle 될 때 마다 전체 요금을 다시 재계산하는 함수
    const refreshOrderTotalPrice = (products) => {
        let total = 0; // 총 금액 변수

        products.forEach(bean => {
            if(bean.checked) { // 선택된 체크박스에 대하여
                total += bean.price * bean.quantity; // 총 금액 누적
            }
        });

        setOrderTotalPrice(total); // State 업데이트
    };

    // 개별 체크박스를 클릭함
    const toggleCheckBox = (cartProductId) => {
        console.log(`카트 상품 아이디 : ${cartProductId}`);

        setCartProducts((previous) => {
            // !product.checked : 체크 상태 toggle
            const updatedProducts = previous.map((product)=>(
                product.cartProductId === cartProductId
                ? {...product, checked: !product.checked}
                : product
            ));

            refreshOrderTotalPrice(updatedProducts);
            return updatedProducts;
        });
    };

    // 카트 상품 목록에서 특정 상품의 구매 수량을 변경함
    const changeQuatity = async (cartProductId, quantity) => {
        // NaN : Not a Number
        if(isNaN(quantity)) { // 숫자 형식이 아니면
            // 값을 0으로 변경한 다음 함수를 반환
            setCartProducts((previous) => {
                return previous.map((product) => 
                    product.cartProductId === cartProductId ? {...product, quantity:1} : product
                );
            });
            alert('변경 수량은 최소 1이상 이어야 합니다.');
            return;
        }

        try {
            // 사용 예시 : 100번 항목을 10개로 수정
            // http://localhost:9000/cart/edit/100?quantity=10
            const url = `${API_BASE_URL}/cart/edit/${cartProductId}?quantity=${quantity}`;

            // patch 동작은 전체가 아닌 일부 데이터를 변경하고자 할 때 사용
            // Spring의 WebConfig 클래스 안의 addCorsMappings() 메소드를 참조
            const response = await axios.patch(url);

            console.log(response.data || '');

            // cartProducts의 수량 정보 갱신
            setCartProducts((previous) => {
                const updatedProducts = previous.map((product) => 
                    product.cartProductId === cartProductId 
                    ? {...product, quantity:quantity} // {...product, quantity} 도 가능
                    : product
                );

                refreshOrderTotalPrice(updatedProducts);
                return updatedProducts;
            });

        } catch (error) {
            console.log('카트 상품 수량 변경 실패');
            console.log(error);
        }
    };

    // 선택된 항목의 카트 상품 아이디를 이용하여 해당 품목을 목록에서 제거
    const deleteCartProduct = async (cartProductId) => {
        const isConfirmed = window.confirm(`해당 카트 상품을 삭제하시겠습니까?`);

        if(isConfirmed) {
            console.log('삭제할 카트 상품 아이디 : ' + cartProductId);

            try {
                const url = `${API_BASE_URL}/cart/delete/${cartProductId}`;
                const response = await axios.delete(url);

                // 카트 상품 목록을 갱신하고 요금을 다시 계산
                setCartProducts((previous) => {
                    const updatedProducts = previous.filter((bean) => bean.cartProductId !== cartProductId);

                    refreshOrderTotalPrice(updatedProducts);
                    return updatedProducts;
                });

                alert(response.data);

            } catch (error) {
                console.log('카트 상품 삭제 동작 오류');
                console.log(error);
            }
        } else {
            alert(`카트 상품 삭제를 취소하셨습니다.`);
        }
    };

    // 사용자가 '주문하기' 버튼을 클릭
    const makeOrder = async () => {
        // 체크박스가 체크된 물품만 필터링
        const selectedProducts = cartProducts.filter((bean) => bean.checked);
        if(selectedProducts.length === 0) {
            alert('주문 할 상품을 선택 해 주세요.');
            return;
        }

        try {
            const url = `${API_BASE_URL}/order`;

            // 스프링 부트의 OrderDto, OrderItemDto 클래스와 연관이 있음
            // 주의) parameters 작성 시 OrderDto의 변수 이름과 동일하게 작성
            const parameters = {
                memberId:props.user.id,
                status:'PENDING',
                orderItems:selectedProducts.map((product) => ({
                    cartProductId:product.cartProductId,
                    productId:product.productId,
                    quantity:product.quantity
                }))
            };

            console.log('주문할 데이터 정보');
            console.log(parameters);

            const response = await axios.post(url, parameters);
            alert(response.data);

            // 방금 주문한 품목은 장바구니 목록에서 제거
            setCartProducts((previous) => 
                previous.filter((product) => !product.checked) // 주문한 상품 제거 
            );

            setOrderTotalPrice(0); // 총 주문 금액 초기화

        } catch (error) {
            console.log('주문 기능 실패');
            console.log(error);
        }
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                {/* xxrem은 주위 글꼴의 xx배를 의미합니다. */}
                <span style={{ color: 'blue', fontSize: '2rem' }}>{props.user?.name}</span>
                <span style={{ fontSize: '1.3rem' }}>님의 장바구니</span>
            </h2>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th style={thStyle} >
                            {/* 전체 선택 체크 박스의 체크 상태(boolean)를 toggleAllCheckBox 함수에 전달  */}
                            <Form.Check
                                type="checkbox"
                                label="전체 선택"
                                onChange={(event) => {toggleAllCheckBox(event.target.checked)}}
                            />
                        </th>
                        <th style={thStyle}>상품 정보</th>
                        <th style={thStyle}>수량</th>
                        <th style={thStyle}>금액</th>
                        <th style={thStyle}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {cartProducts.length > 0 ? (
                        cartProducts.map((product) => (
                            <tr key={product.cartProductId}>
                                <td className="text-center align-middle">
                                    {/* 어떤 체크인지 식별하기 위하여 toggleCheckBox 함수에 cartProductId를 넘김 */}
                                    <Form.Check 
                                        type="checkbox" 
                                        checked={product.checked}
                                        style={{transform:"scale(1.4)"}}
                                        onChange={() => toggleCheckBox(product.cartProductId)}
                                    />
                                </td>
                                <td className="text-center align-middle">
                                    <Row> {/* 좌측 4칸은 이미지 영역, 우측 8칸은 상품 이름 영역 */}
                                        <Col xs={4}><Image src={`${API_BASE_URL}/images/${product.image}`} alt={product.image} width={80} height={80} thumbnail /></Col>
                                        <Col xs={8} className="d-flex align-items-center">
                                            {product.name}
                                        </Col>
                                    </Row>
                                </td>
                                <td className="text-center align-middle">
                                    <Form.Control 
                                        type="number" 
                                        value={product.quantity} 
                                        min={1} 
                                        onChange={(event) => changeQuatity(product.cartProductId, event.target.value)} 
                                        style={{width:'80px', margin:'0 auto'}}
                                    />
                                </td>
                                <td className="text-center align-middle">{(product.price * product.quantity).toLocaleString()}원</td>
                                <td className="text-center align-middle">
                                    <Button variant="danger" size="sm" 
                                        onClick={() => deleteCartProduct(product.cartProductId)}>
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">장바구니가 비어 있습니다.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* 좌측 정렬(text-start), 가운데 정렬(text-center), 우측 정렬(text-end) */}
            <h3 className="text-end mt-3">총 주문 금액 : {orderTotalPrice.toLocaleString()}원</h3>
            <div className="text-end">
                <Button variant="primary" size="lg" onClick={makeOrder}>
                    주문하기
                </Button>
            </div>
        </Container>
    );
}

export default App;