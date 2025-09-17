import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css'; // for 부트 스트랩

// Router는 App.js 파일 내의 모든 라우터 정보를 감싸는 역할
import { BrowserRouter, Router } from 'react-router-dom'; // 신규 생성

const root = ReactDOM.createRoot(document.getElementById('root'));
// StrictMode 코드 삭제 : 개발 도중에 발생하는 문제를 주기적으로 감지 하기 위하여 rendering을 2번 수행
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
