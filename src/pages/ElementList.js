import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Table } from "react-bootstrap";

function App() {
    const [elementList, setElementList] = useState(); // 넘어온 과일 목록

    useEffect(() => {
        const url = `${API_BASE_URL}/element/list`;

        axios
            .get(url, {})
            .then((response) => {
                setElementList(response.data);
            });
    }, []);

    return(
        <>
            <Table striped bordered hover style={{margin:'5px'}}>
                <thead>
                    <tr>
                        <td>아이디</td>
                        <td>상품명</td>
                        <td>단가</td>
                        <td>카테고리</td>
                        <td>재고</td>
                        <td>사진</td>
                        <td>설명</td>
                    </tr>
                </thead>
                <tbody>
                    {elementList && elementList.map((element) => (
                        <tr key={element.id}>
                            <td>{element.id}</td>
                            <td>{element.name}</td>
                            <td>{Number(element.price).toLocaleString()}원</td>
                            <td>{element.category}</td>
                            <td>{element.stock}</td>
                            <td>{element.image}</td>
                            <td>{element.description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default App;