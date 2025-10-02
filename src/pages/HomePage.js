import Carousel from 'react-bootstrap/Carousel';
import Container from "react-bootstrap/Container";
import { API_BASE_URL } from '../config/config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
    // products : 메인화면에 보여주고자 하는 상품 정보들(파일 이름에 bigs가 포함됨)
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 이미지 파일 이름에 "bigs"라는 글자가 포함되어 있는 이미지만 추출
        const url = `${API_BASE_URL}/product?filter=bigs`;
        axios
            .get(url)
            .then((response) => setProducts(response.data))
            .catch((error) => console.log(error));
    }, []);

    const detailView = (id) => {
        navigate(`/product/detail/${id}`);
    };

    return(
        <Container>
            <Carousel className='my-4'>
                {products.map((bean) => (
                    <Carousel.Item key={bean.id}>
                        <img
                            className="d-block w-100"
                            src={`${API_BASE_URL}/images/${bean.image}`}
                            alt={bean.name}
                            style={{cursor:'pointer'}} // 마우스 오버 시 커서 변경
                            onClick={() => detailView(bean.id)} // 클릭 시 상세 보기 페이지
                        />
                        <Carousel.Caption>
                            <h3>{bean.name}</h3>
                            <p>
                                {/* 긴 글자는 짧게 보여주고 "..."을 붙여 출력 */}
                                {bean.description.length > 20 
                                    ? bean.description.substring(0, 20) + "..."
                                    : bean.description
                                }
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
}

export default App;