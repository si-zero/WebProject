// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('백엔드 정상 작동 중!');
});

app.listen(PORT, () => {
  console.log(`✅ 백엔드 서버 실행됨: http://localhost:${PORT}`);
});
