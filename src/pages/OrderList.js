import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { API_BASE_URL } from "../config/config";
import { useNavigate } from "react-router-dom";


function App(props) {
    // loading이 true면 현재 데이터를 읽고 있는 중
    const [loading, setLoading] = useState(true);

    // 오류 정보를 저장할 State
    const [error, setError] = useState('');

    // 주문 목록등를 저장할 State (초기값 빈배열)
    const [orders, setOrders] = useState([]);

    // 다음 hook은 사용자 정보 user가 변경될 때 마다 rendering
    useEffect(() => {
        if(!props.user) {
            setError('로그인이 필요합니다');
            setLoading(false);
        }

        // Spring Boot의 OrderController getOrderList() 메소드 참조
        const fetchOrders = async () => {
            try {
                const url = `${API_BASE_URL}/order/list`;
                // get 방식은 parameter를 넘길 때, params라는 key를 사용하여 넘겨야 함
                // 여기서 role은 관리자 유무를 판단하기 위해 넘겨준다
                const parameters = {params:{memberId:props.user.id, role:props.user.role}};
                const response = await axios.get(url, parameters);
                setOrders(response.data);
            } catch (error) {
                setError('주문 목록을 불러 오는데 실패하였습니다.');
                console.log(error);
            } finally {
                setLoading(false);
            };
        };
        fetchOrders(); // 함수 호출
    }, [props.user]);

    const navigate = useNavigate();

    // 관리자를 위한 컴포넌트, 함수
    const makeAdminButton = (bean) => {
        // if(props.user?.role !== "ADMIN" && props.user?.role !== "USER") return null;
        if(props.user == null) return null;
        // if (!["ADMIN", "USER"].includes(props.user?.role)) return null;

        // 완료 버튼을 클릭시 'PENDING' -> 'COMPLETED' 변경
        const changeStatus = async (newStatus) => {
            try {
                const url = `${API_BASE_URL}/order/update/status/${bean.orderId}?status=${newStatus}`;
                await axios.put(url);

                alert(`주문 번호 ${bean.orderId}번 상태가 ${newStatus}로 변경 되었습니다`);

                // 'COMPLETED' 모드로 변경되고 나면 화면에서 삭제
                // bean.orderId와 동일하지 않은 항목들만 다시 rendering
                setOrders((previous) => previous.filter((order) => order.orderId !== bean.orderId));
                
            } catch (error) {
                console.log(error);
                alert('상태 변경(주문 완료)에 실패하였습니다.');
            }
        }

        // 취소 버튼을 클릭시 주문 대기 상태인 주문 내역을 취소
        const orderCancel = async () => {
            try {
                const url = `${API_BASE_URL}/order/delete/${bean.orderId}`;
                await axios.delete(url);

                alert(`주문 번호 ${bean.orderId}번이 취소 되었습니다`);

                // bean.orderId와 동일하지 않은 항목들만 다시 rendering
                setOrders((previous) => previous.filter((order) => order.orderId !== bean.orderId));
                
            } catch (error) {
                console.log(error);
                alert('주문 취소에 실패하였습니다.');
            }
        }

        return (
            <div>
                {/* 완료 버튼은 관리자만 볼 수 있음 */}
                {props.user?.role === 'ADMIN' && (
                    <Button variant="success" size="sm" className="me-2" 
                    onClick={() => changeStatus('COMPLETED')}>
                    완료
                </Button>
                )}
                <Button variant="danger" size="sm" className="me-2" 
                    onClick={() => orderCancel()}
                >
                    취소
                </Button>
            </div>
        );
    };

    if(loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">주문 목록을 불러오는 중입니다.</span>
                </Spinner>
            </div>
        );
    };

    if(error) {
        return (
            <Container className="my-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    };

    return(
        <Container className="my-4">
            <h1 className="my-4">주문 내역</h1>
            {orders.length === 0 ? (
                <Alert variant="secondary">주문 내역이 없습니다.</Alert>
            ) : (
                <Row>
                    {orders.map((bean) => (
                        <Col key={bean.orderId} md={6} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>주문 번호 : {bean.orderId}</Card.Title>
                                        <small className="text-muted">{bean.orderDate}</small>
                                    </div>
                                    <Card.Text>
                                        상태 : <strong>{bean.status}</strong>
                                    </Card.Text>
                                    <ul style={{paddingLeft:"20px"}}>
                                        {bean.orderItems.map((item, index) => (
                                            <li key={index}>
                                                {item.productName}({item.quantity}개)
                                            </li>
                                        ))}
                                    </ul>
                                    {/* 관리자 전용 버튼 생성 */}
                                    {makeAdminButton(bean)}
                                </Card.Body>
                                
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default App;