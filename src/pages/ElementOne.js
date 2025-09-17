import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import Table from "react-bootstrap/Table";

function App() {
    const [element, setElement] = useState({});

    useEffect(() => {
        const url = `${API_BASE_URL}/element`;

        axios
            .get(url, {})
            .then((response) => {
                console.log('응답 받은 데이터');
                console.log(response.data);
                setElement(response.data);
            });
    }, []);

    return(
        <>
            <Table striped bordered hover style={{margin:'5px'}}>
                <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>{element.id}</td>
                    </tr>
                    <tr>
                        <td>상품명</td>
                        <td>{element.name}</td>
                    </tr>
                    <tr>
                        <td>단가</td>
                        <td>{Number(element.price).toLocaleString()}원</td>
                    </tr>
                    <tr>
                        <td>카테고리</td>
                        <td>{element.category}</td>
                    </tr>
                    <tr>
                        <td>재고</td>
                        <td>{element.stock}</td>
                    </tr>
                    <tr>
                        <td>사진</td>
                        <td>{element.image}</td>
                    </tr>
                    <tr>
                        <td>설명</td>
                        <td>{element.description}</td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}

export default App;