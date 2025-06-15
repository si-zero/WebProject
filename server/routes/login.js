const fs = require('fs');
const path = require('path');

const loginHandler = (req, res) => {
  const { email, password } = req.body;

  const usersPath = path.join(__dirname, '../data/users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  console.log(users);

  const foundUser = users.find(
    user => user.email === email && user.password === password
  );

  if (foundUser) {
    const { password, ...safeUser } = foundUser;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, user: safeUser }));
  } else {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' }));
  }
};

module.exports = { loginHandler };
