import './Login.css';
import { useState } from 'react';

const Login = ( { onClose } ) => {
    const [form, setForm] = useState({email: '', password: ''});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleLogin = () => {
        if (form.email == 'snm306@naver.com' && form.password == '1234') {
            alert('로그인 성공!');
            navigate('/');
        }

        else {
            alert('로그인 실패..');
        }
    }

    return (
        <>
            <div className='login-backdrop' onClick={onClose}>
                <div className="login-content" onClick={(e) => e.stopPropagation()}>
                    <img src='assets/main_logo.png'/>
                    <div>
                        <p>아이디</p>
                        <input name='email' onChange={handleChange}></input>
                    </div>
                    <div>
                        <p>비밀번호</p>
                        <input name='password' onChange={handleChange}></input>
                    </div>
                    <div>
                        <button onClick={handleLogin}>로그인</button>
                    </div>
                    <button onClick={onClose}>닫기</button>
                </div>
            </div>
        </>
    );
}

export default Login;