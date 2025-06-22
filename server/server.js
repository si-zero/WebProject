// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import registerRouter from './routes/register.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.json());

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 로그인 라우터 (예시)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const usersPath = path.join(__dirname, 'data', 'users.json');
  try {
    const rawData = fs.readFileSync(usersPath, 'utf-8');
    const users = JSON.parse(rawData);

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      res.json({ success: true, user: foundUser });
    } else {
      res.json({ success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류: 로그인 실패' });
  }
});

// 회원가입 라우터
app.use('/api/register', registerRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});