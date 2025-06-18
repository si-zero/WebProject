import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      // 로그인 상태면 팝업 없이 바로 메인으로 이동
      navigate("/main");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("로그인 성공!");
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user); // UserContext의 상태 변경
        navigate("/main"); // 로그인 후 메인 페이지로 이동
      } else {
        alert(result.message || "로그인 실패");
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생:", error);
      alert("서버 오류: 로그인 실패");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="login-backdrop">
      <div className="login-content">
        <div className="login-logo" onClick={handleLogoClick}>
          <img src="/main_logo.png" alt="로고" />
        </div>

        <div className="login">
          <p className="login-text">아이디</p>
          <input
            className="login-context"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="password">
          <p className="password-text">비밀번호</p>
          <input
            className="password-context"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="login-area">
          <div className="login-options">
            <div className="check-login">
              <input type="checkbox" />
              <p>로그인 유지</p>
            </div>
            <div className="find">
              <span>아이디 찾기</span>
              <span>|</span>
              <span>비밀번호 찾기</span>
            </div>
          </div>

          <div className="login-button">
            <button className="login-button" onClick={handleLogin}>
              로그인
            </button>
          </div>

          <div className="register-box">
            <p className="find">아직 회원이 아니신가요?</p>
            <p
              className="register-font"
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate("/register")}
            >
              회원가입 하기
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
