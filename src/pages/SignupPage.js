import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import Button from "react-bootstrap/Button";


function App() {
    // 파라미터 관련 state 변수 선언
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    return(
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">회원 가입</h2>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>이름</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="이름을 입력해 주세요."
                                        value={name}
                                        onChange={(event) => {setName(event.target.value)}}
                                    />
                                </Form.Group>
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
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>주소</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        placeholder="주소을 입력해 주세요."
                                        value={address}
                                        onChange={(event) => {setAddress(event.target.value)}}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    회원 가입
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default App;