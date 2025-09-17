import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import Table from "react-bootstrap/Table";

// axios 라이브러리를 이용하여 리액트에서 스프링으로 데이터를 요청해야 함
function App() {
    const [fruit, setFruit] = useState({});

    useEffect(() => { // BackEnd 서버에서 데이터 읽어 오기
        const url = `${API_BASE_URL}/fruit`; // 요청할 url

        axios
            .get(url, {})
            .then((response) => { // 응답이 성공 했을 때
                console.log('응답 받은 데이터');
                console.log(response.data);
                setFruit(response.data);
            });
    }, []);

    return(
        <>
            <Table striped bordered hover style={{margin:'5px'}}>
                <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>{fruit.id}</td>
                    </tr>
                    <tr>
                        <td>상품명</td>
                        <td>{fruit.name}</td>
                    </tr>
                    <tr>
                        <td>단가</td>
                        <td>{Number(fruit.price).toLocaleString()}원</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}

export default App;