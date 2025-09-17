import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import axios from "axios";
import { Table } from "react-bootstrap";

function App() {
    const [fruitList, setFruitList] = useState(); // 넘어온 과일 목록

    useEffect(() => {
        const url = `${API_BASE_URL}/fruit/list`;

        axios
            .get(url, {})
            .then((response) => {
                setFruitList(response.data);
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
                    </tr>
                </thead>
                <tbody>
                    {fruitList && fruitList.map((fruit) => (
                        <tr key={fruit.id}>
                            <td>{fruit.id}</td>
                            <td>{fruit.name}</td>
                            <td>{fruit.price.toLocaleString()}원</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default App;