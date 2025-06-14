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
                <div className='login-content' onClick={(e) => e.stopPropagation()}>
                    <div className='login-logo'>
                        <img src='src/assets/main_logo.png'/>
                    </div>
                    <div className='login'>
                        <p className='login-text'>아이디</p>
                        <input className='login-context' name='email' onChange={handleChange}></input>
                    </div>
                    <div className='password'>
                        <p className='password-text'>비밀번호</p>
                        <input className='password-context' name='password' onChange={handleChange}></input>
                    </div>
                    <div className='login-area'>
                        <div className='login-options'>
                            <div className='check-login'>
                                <input type='checkbox'></input>
                                <p>로그인 유지</p>
                            </div>
                                
                            <div className='find'>
                                <span>아이디 찾기</span>
                                <span>|</span>
                                <span>비밀번호 찾기</span>
                            </div>
                        </div>
                        
                        <div className='login-button'>
                            <button className='login-button' onClick={handleLogin}>로그인</button>
                        </div>
                        <div className='register-box'>
                            <p className='find'>아직 회원이 아니신가요?</p>
                            <p className='register-font'>회원가입 하기</p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default Login;