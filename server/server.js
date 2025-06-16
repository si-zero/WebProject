// server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

// 🔧 JSON 형식 바디 파싱
app.use(express.json());

// 🔧 CORS 허용
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 개발용
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ✅ 로그인 라우트
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const usersPath = path.join(__dirname, 'data/users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  const foundUser = users.find(user => user.email === email && user.password === password);

  if (foundUser) {
    const { password, ...safeUser } = foundUser;
    res.json({ success: true, user: safeUser });
  } else {
    res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
  }
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}`);
});
