// 로그인 라우터
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // users.json 파일 경로 계산
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