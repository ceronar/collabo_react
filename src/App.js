import './App.css';

// 분리된 리엑트 컴포넌트 import
import MenuItems from './ui/MenuItems';
import AppRoutes from './routes/AppRoutes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const appName = "IT Academy Coffee Shop";
  const navigate = useNavigate();
  // user : 로그인한 사람의 정보를 저장하는 State
  // 클라이언트에서 사용자의 정보를 저장하기 위하여 localStorage 사용
  const [user, setUser] = useState(null);

  // JSON.parse() : JSON형태의 문장과 자바 스크립트 객체 형태로 변환해줌
  useEffect(() => {
    // localStorage -> sessionStorage : 탭마다 로그인 적용(닫으면 자동 로그아웃)
    const loginUser = sessionStorage.getItem('user');
    setUser(JSON.parse(loginUser));
  }, []); // 두번째 매개 변수가 empty array 이므로 한번만 rendering

  const handleLoginSuccess = (userData) => {
    // LoginPage.js에서 반환 받은 member 정보
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
    console.log('로그인 성공');
  }
  
  const handleLogout = () => {
    // 저장된 로그인 정보 제거
    sessionStorage.removeItem("user");
    setUser(null); // App state도 초기화

    // 원하는 페이지로 이동
    navigate("/");
  };

  return (
    <>
      <MenuItems appName={appName} user={user} handleLogout={handleLogout} />

      {/* 분리된 라우터 정보 */}
      <AppRoutes user={user} handleLoginSuccess={handleLoginSuccess} />

      <footer className='bg-dark text-light text-center py-3 mt-5'>
        <p>&copy; 2025 {appName} All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
