//import './Register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        checkPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        const { name, email, password, checkPassword } = form;

        if (!name || !email || !password || !checkPassword) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        if (password !== checkPassword) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert('회원가입 성공!');
                navigate('/login');
            } else {
                alert(result.message || '회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 요청 중 오류:', error);
            alert('서버 오류가 발생했습니다.');
        }
    }

    return (
        <>
            <div className='register-backdrop'>
                <div className='register-content' onClick={(e) => e.stopPropagation()}>
                    <div className='register-name'>
                        <p className='register-name-text'>이름</p>
                        <input className='register-name-context' name='name' value={form.name} onChange={handleChange}></input>
                    </div>
                    <div className='register-email'>
                        <p className='register-email-text'>아이디</p>
                        <input className='register-email-context' name='email' value={form.email} onChange={handleChange}></input>
                    </div>
                    <div className='register-password'>
                        <p className='register-password-text'>비밀번호</p>
                        <input className='register-password-context' name='password' type='password' value={form.password} onChange={handleChange}></input>
                    </div>
                    <div className='register-checkPassword'>
                        <p className='register-checkPassword-text'>비밀번호 확인</p>
                        <input className='register-checkPassword-context' type='password' name='checkPassword' value={form.checkPassword} onChange={handleChange}></input>
                    </div>
                    <div className='register-area'>
                        <div className='register-area-button'>
                            <button className='register-area-button' onClick={handleRegister}>가입하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
