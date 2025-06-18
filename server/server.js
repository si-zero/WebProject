const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;

// === 파일 경로 설정 ===
const FILE_PATH = path.join(__dirname, "data", "likedlist.json"); // 찜 목록 데이터 경로
const GOODS_PATH = path.join(__dirname, "data", "goods.json"); // 상품 데이터 경로
const EVENTS_PATH = path.join(__dirname, "data", "event.json"); // 이벤트 데이터 경로
const USERS_PATH = path.join(__dirname, "data", "users.json"); // 회원가입/로그인용 유저 데이터 경로

app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 바디 파싱

// 로그 출력 함수
function log(message) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${message}`);
}

// 찜 데이터 메모리 캐시
let likedCache = { liked: [] };

// 서버 시작 시 찜 데이터 초기 로드 (동기)
try {
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  if (data && Array.isArray(data.liked)) {
    likedCache.liked = data.liked;
    log("서버 시작 - 찜 데이터 메모리 로드 완료");
  }
} catch (error) {
  log("서버 시작 - 찜 데이터 로드 실패, 초기화함: " + error.message);
}

// 찜 데이터 저장 함수
function saveLikedData() {
  fs.writeFile(FILE_PATH, JSON.stringify(likedCache, null, 2), (err) => {
    if (err) log("찜 데이터 저장 실패: " + err.message);
    else log("찜 데이터 저장 성공");
  });
}

// === 찜 목록 조회 API ===
app.get("/api/liked", (req, res) => {
  log("GET /api/liked - 찜 목록 조회");
  res.json(likedCache);
});

// === 찜 상태 업데이트 API ===
app.post("/api/liked", (req, res) => {
  const { id, liked } = req.body;

  if (typeof id === "undefined" || typeof liked === "undefined") {
    log("POST /api/liked - 잘못된 요청: id 또는 liked 없음");
    return res.status(400).json({ message: "id and liked are required" });
  }

  let likedList = likedCache.liked;

  if (liked) {
    if (!likedList.includes(id)) {
      likedList.push(id);
      log(`POST /api/liked - id ${id} 찜 추가`);
    } else {
      log(`POST /api/liked - id ${id} 이미 찜 목록에 있음`);
    }
  } else {
    if (likedList.includes(id)) {
      likedCache.liked = likedList.filter((item) => item !== id);
      log(`POST /api/liked - id ${id} 찜 해제`);
    } else {
      log(`POST /api/liked - id ${id} 찜 목록에 없음 (삭제 무시)`);
    }
  }

  saveLikedData();

  res.json(likedCache);
});

// === 이벤트 전체 조회 API ===
app.get("/api/events", (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(EVENTS_PATH, "utf-8"));
    log("GET /api/events - 이벤트 조회 성공");
    res.json(events);
  } catch (error) {
    log("GET /api/events - 이벤트 조회 실패: " + error.message);
    res.status(500).json({ message: "Failed to read event.json" });
  }
});

// === 상품 데이터 제공 API ===
app.get("/data/goods", (req, res) => {
  try {
    const { category, page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));

    let products = [];

    if (!category || category === "전체") {
      Object.values(goodsData).forEach(arr => {
        products = products.concat(arr);
      });
    } else {
      products = goodsData[category] || [];
    }

    const total = products.length;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const pagedProducts = products.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    log(`GET /data/goods - category: ${category || "전체"}, page: ${pageNum}, limit: ${limitNum}`);

    res.json({
      products: pagedProducts,
      page: pageNum,
      limit: limitNum,
      total,
      hasMore,
    });
  } catch (error) {
    log("GET /data/goods - 상품 데이터 조회 실패: " + error.message);
    res.status(500).json({ message: "Failed to read goods.json" });
  }
});

// === 찜한 상품만 조회 API ===
app.get("/api/liked-products", (req, res) => {
  try {
    const likedIds = likedCache.liked;

    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));
    const allProducts = Object.values(goodsData).flat();

    const likedProducts = allProducts.filter(product => likedIds.includes(product.id));

    log("GET /api/liked-products - 찜한 상품 조회 성공");

    res.json(likedProducts);
  } catch (error) {
    log("GET /api/liked-products - 찜한 상품 조회 실패: " + error.message);
    res.status(500).json({ message: "Failed to load liked products" });
  }
});

// === 카테고리별 상품 반환 API ===
app.get("/api/products-by-category", (req, res) => {
  const { category, count, id } = req.query;
  const limit = parseInt(count, 10) || 5;

  if (!category) {
    return res.status(400).json({ error: "category is required" });
  }

  try {
    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));
    const items = goodsData[category];

    if (!items) {
      return res.status(404).json({ error: "Category not found." });
    }

    const initialSlice = items.slice(0, limit + 1);

    let finalProducts;

    if (id) {
      const hasId = initialSlice.some(product => product.id === id);

      if (hasId) {
        finalProducts = initialSlice.filter(product => product.id !== id).slice(0, limit);
      } else {
        finalProducts = initialSlice.slice(0, limit);
      }
    } else {
      finalProducts = initialSlice.slice(0, limit);
    }

    log(`GET /api/products-by-category - category: ${category}, count: ${limit}, excluded id: ${id || "none"}`);

    res.json({ products: finalProducts });
  } catch (error) {
    log("GET /api/products-by-category - 상품 데이터 조회 실패: " + error.message);
    res.status(500).json({ error: "Failed to read goods.json" });
  }
});

// === 로그인 API ===
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
      const { password, ...safeUser } = foundUser; // 비밀번호 제외
      log(`POST /login - 로그인 성공 (email: ${email})`);
      res.json({ success: true, user: safeUser });
    } else {
      log(`POST /login - 로그인 실패 (email: ${email})`);
      res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 틀렸습니다.' });
    }
  } catch (error) {
    log("POST /login - 서버 오류: " + error.message);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// === 회원가입 API ===
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  // (1) 필수 필드 검사
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));

    // (2) 이메일 + 비밀번호 조합 중복 확인 (동시에 일치하는 경우만 불가)
    const exists = users.some(user => user.email === email && user.password === password);
    if (exists) {
      return res.status(409).json({ success: false, message: '이미 존재하는 이메일과 비밀번호 조합입니다.' });
    }

    // (3) 새 유저 객체 생성 (role은 user로 고정, introduction은 빈 문자열)
    const newUser = {
      id: 'u' + (users.length + 1),
      name,
      introduction: '',
      likes_product: [],
      role: 'user',
      products: [],
      email,
      password,
    };

    // (4) 배열에 새 유저 추가 및 파일 저장
    users.push(newUser);
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

    // (5) 성공 응답 반환 (비밀번호 제외해서 보내기)
    const { password: pw, ...safeUser } = newUser;
    res.status(201).json({ success: true, user: safeUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 서버 실행
app.listen(PORT, () => {
  log(`Server running on http://localhost:${PORT}`);
});