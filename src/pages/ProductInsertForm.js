import axios from "axios";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";

/**
 * 상품 등록이 회원 가입과 다른점 : 파일 업로드
 * step 01 : 
 * 폼 양식을 만듦
 * ControlChange 함수
 *      각 컨트롤에 대한 change 이벤트 함수 구현
 *      컨트롤(input type) : 이름, 가격, 재고, 상품 설명
 *      컨트롤(combo type) : 카테고리
 * 
 * FileSelect 함수
 *      업로드할 이미지 선택에 대한 이벤트 함수를 구현
 *      FileReaderAPI를 사용하여 해당 이미지를 Base64 인코딩 문자열로 변환 작업을 함
 * 
 * SubmitAction 함수
 *      컨트롤에 입력된 내용들을 BackEnd로 전송
 * 
 * 파일 업로드 시 유의사항
 *      전송 방식 post
 *      input 양식 type="file"
 */

function App() {
    const comment = '상품 등록';
    const nevigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const initial_value = {
        name: '', price: '', category: '', stock: '', image: '', description: ''
    }; // 상품 객체 정보

    // product는 백엔드에게 넘겨 줄 상품 등록 적ㅇ보를 담고 있는 객체
    const [product, setProduct] = useState(initial_value);
    if (user?.role !== 'ADMIN') {
        // 어드민이 아니면 → 홈으로 리다이렉트
        return <Navigate to="/" replace />;
    }

    // 폼 양식에서 어떤 컨트롤의 값이 변경됨
    const ControlChange = (event) => {
        // event 객체는 change 이벤트를 발생시킨 폼 컨트롤
        const {name, value} = event.target;
        // console.log(`값이 바뀐 컨트롤 : ${name}, 값 : ${value}`);

        // 전개 연산자를 사용하여 이전 컨트롤의 값을 보존
        setProduct({ ...product, [name]: value });
    }

    const FileSelect = (event) => {
        // 자바스크립트는 모든 항목들을 배열로 취급함
        const {name, files} = event.target;
        const file = files[0]; // type="file"로 작성한 첫번째 항목

        // FileReader는 웹 브라우저에서 제공해주는 내장 객체로, 파일 읽기에 사용가능
        // 자바스크립트에서 파일을 읽고 이를 데이터로 처리하는데 사용
        const reader = new FileReader();

        // readAsDataURL() 함수는 file 객체를 문자열 형태로 반환하는 역할
        reader.readAsDataURL(file);

        // onloadend : 읽기 작업이 성공하면 자동으로 동작하는 이벤트 핸들러 함수
        reader.onloadend = () => {
            const result = reader.result;
            console.log(result);
            
            // 해당 이미지는 Base64 인코딩 문자열 형식으로 state에 저장
            // 사용 예시 : data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...
            setProduct({ ...product, [name]: result });
        };
    }

    const SubmitAction = async (event) => {
        event.preventDefault();

        try {
            const url = `${API_BASE_URL}/product/insert`;
            // 얕은 복사 : 두 변수가 같은 메모리 공간을 참조한다
            const parameters = product;
            // 깊은 복사 : 새로운 메모리에 같은 값을 복사한다
            // const parameters = {...product};

            // Content-Type(Mime Type) : 문서의 종류가 어떠한 종류인지를 알려주는 항목
            // 예) 'text/html', 'image/jpeg', 'application/json' 등..
            // headers : {'Content-Type' : 'application/json'} : 이 문서는 json 형식의 파일이다
            const config = {headers : {'Content-Type' : 'application/json'}};

            const response = await axios.post(url, parameters, config);

            console.log(`상품 등록 : [${response.data}]`);
            alert('상품이 성공적으로 등록 되었습니다.');

            // 상품 등록후 입력 컨트롤 모두 초기화
            setProduct(initial_value);

            // 등록이 이루어지고 난 후 상품 목록 페이지로 이동
            nevigate('/product/list');
        } catch (error) {
            console.log(`오류 내용 : ${error}`);
            alert('상품 등록에 실패하였습니다.');
        }
    }

    return(
        <Container>
            <h1>{comment}</h1>
            <Form onSubmit={SubmitAction}>
                <Form.Group className="mb-3">
                    <Form.Label>이름</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="이름을(를) 입력해 주세요."
                        name="name"
                        value={product.name}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>가격</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="가격을(를) 입력해 주세요."
                        name="price"
                        value={product.price}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>카테고리</Form.Label>
                    <Form.Select 
                        name="category"
                        value={product.category}
                        onChange={ControlChange}
                        required>
                        {/* 주의) Enum 열거형 타입에서 사용한 대문자를 반드시 사용 */}
                        <option value="-">-- 카테고리 선택 --</option>
                        <option value="BREAD">빵</option>
                        <option value="BEVERAGE">음료수</option>
                        <option value="CAKE">케이크</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>재고</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="재고을(를) 입력해 주세요."
                        name="stock"
                        value={product.stock}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>

                {/* 이미지는 type="file" 이벤트 처리 함수를 따로*/}
                <Form.Group className="mb-3">
                    <Form.Label>이미지</Form.Label>
                    <Form.Control 
                        type="file"
                        name="image"
                        onChange={FileSelect}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>상품 설명</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="상품 설명을(를) 입력해 주세요."
                        name="description"
                        value={product.description}
                        onChange={ControlChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" size="lg">
                    {comment}
                </Button>

            </Form>
        </Container>
    );
}

export default App;