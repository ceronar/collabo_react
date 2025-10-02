import axios from "axios";
import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";

function App(props) {
    // props.setUser : 사용자 정보를 저장하기 위한 setter 메소드

    // 로그인 관련 State 정의
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 오류 메세지 관련 State 정의
    const [errors, setErrors] = useState('');

    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user) {
        // 이미 로그인 상태 → 홈으로 리다이렉트
        return <Navigate to="/" replace />;
    }

    const LoginAction = async (event) => { // 로그인과 관련된 이벤트 처리 함수
        event.preventDefault();

        try {
            const url = `${API_BASE_URL}/member/login`;
            const parameters = {email, password};

            // 스프링 부트가 넘겨 주는 정보는 Map<String, Object> 타입
            const response = await axios.post(url, parameters);

            // message에는 '로그인 성공 여부'를 알리는 내용, member에는 로그인한 사람의 객체 정보 반환
            const {message, member} = response.data;

            if (message === 'success') { // 자바에서 Map.put("message", "success");
                console.log('로그인 한 사람의 정보');
                console.log(member);
                // 로그인 성공시 사용자 정보를 어딘가에 저장
                // localStorage.setItem("user", JSON.stringify(member));
                props.setUser(member);

                navigate('/'); // 로그인 성공 후 홈페이지로 이동

            } else { // 로그인 실패
                setErrors(message);
            }

        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.message || '로그인 실패');
            } else {
                setErrors('Server Error');
            }
        }

    }

    return(
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">로그인</h2>

                            {errors && <Alert variant="danger">{errors}</Alert>}

                            <Form onSubmit={LoginAction}>
                                <Form.Group className="mb-3">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="이메일을 입력해 주세요."
                                        value={email}
                                        onChange={(event) => {setEmail(event.target.value)}}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>비밀번호</Form.Label>
                                    <Form.Control 
                                        type="password"
                                        placeholder="비밀번호을 입력해 주세요."
                                        value={password}
                                        onChange={(event) => {setPassword(event.target.value)}}
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col xs={8}>
                                        <Button variant="primary" type="submit" className="w-100">
                                            로그인
                                        </Button>
                                    </Col>
                                    <Col xs={4}>
                                        <Link to={`/member/signup`} className="btn btn-outline-secondary w-100">
                                            회원가입
                                        </Link>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;