// server/routes/register.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  const usersPath = path.join(__dirname, '../data/users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  const exists = users.some((user) => user.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: '이미 존재하는 이메일입니다.' });
  }

  const newUser = {
    id: 'u' + (users.length + 1),
    name,
    introduction: '안녕하세요',
    likes_product: [],
    role: 'seller',
    products: [],
    email,
    password,
  };

  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.status(201).json({ success: true, user: newUser });
});

export default router;