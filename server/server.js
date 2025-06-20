const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;

// === 파일 경로 설정 ===
const GOODS_PATH = path.join(__dirname, "data", "goods.json");
const EVENTS_PATH = path.join(__dirname, "data", "event.json");
const USERS_PATH = path.join(__dirname, "data", "users.json");

app.use(cors());
app.use(express.json());

// === 로그 출력 함수 ===
function log(message) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${message}`);
}

// === 찜 상태 업데이트 API ===
app.post("/api/liked", (req, res) => {
  const { id, liked, userId } = req.body;

  if (typeof id === "undefined" || typeof liked === "undefined" || !userId) {
    log("POST /api/liked - 잘못된 요청: id, liked, userId 모두 필요");
    return res.status(400).json({ message: "id, liked, userId 모두 필요합니다." });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      log(`POST /api/liked - userId ${userId} 를 가진 대상이 없습니다.`);
      return res.status(404).json({ message: `userId ${userId} 를 가진 대상이 없습니다.` });
    }

    const user = users[userIndex];

    if (liked) {
      if (!user.likes_product.includes(id)) {
        user.likes_product.push(id);
        log(`POST /api/liked - ${userId} 유저의 찜목록에 ${id}를 on`);
      }
    } else {
      user.likes_product = user.likes_product.filter(pid => pid !== id);
      log(`POST /api/liked - ${userId} 유저의 찜목록에 ${id}를 off`);
    }

    users[userIndex] = user;
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

    res.json({ liked: user.likes_product });
  } catch (error) {
    log("POST /api/liked - 찜 상태 업데이트 실패: " + error.message);
    res.status(500).json({ message: "찜 상태 업데이트 실패" });
  }
});

// === 찜한 상품 목록 조회 API (로그인 + 비로그인 통합) ===
app.post("/api/liked-products", (req, res) => {
  const { userId, likedIds } = req.body;

  try {
    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));
    const allProducts = Object.values(goodsData).flat();
    let filtered = [];

    if (userId) {
      const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
      const user = users.find(u => u.id === userId);
      if (!user) {
        log(`POST /api/liked-products - userId ${userId} 를 가진 대상이 없습니다.`);
        return res.status(404).json({ message: `userId ${userId} 를 가진 대상이 없습니다.` });
      }
      filtered = allProducts.filter(product => user.likes_product.includes(product.id));
    } else if (Array.isArray(likedIds)) {
      filtered = allProducts.filter(product => likedIds.includes(product.id));
    } else {
      return res.status(400).json({ message: "userId 또는 likedIds 필요" });
    }

    log(`POST /api/liked-products - 찜 목록 조회 성공`);
    res.json(filtered);
  } catch (error) {
    log("POST /api/liked-products - 찜한 상품 조회 실패: " + error.message);
    res.status(500).json({ message: "찜한 상품 조회 실패" });
  }
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

// === 상품 데이터 제공 API (페이징 포함) ===
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
      const hasId = initialSlice.some(product => product.id === parseInt(id));
      if (hasId) {
        finalProducts = initialSlice.filter(product => product.id !== parseInt(id)).slice(0, limit);
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
      const { password, ...safeUser } = foundUser;
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

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));

    const exists = users.some(user => user.email === email && user.password === password);
    if (exists) {
      return res.status(409).json({ success: false, message: '이미 존재하는 이메일과 비밀번호 조합입니다.' });
    }

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

    users.push(newUser);
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

    const { password: pw, ...safeUser } = newUser;
    res.status(201).json({ success: true, user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});
// === 유저가 보유한 상품 목록 조회 API ===
app.post("/api/user-products", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));

    const user = users.find(u => u.id === userId);

    if (!user) {
      log(`POST /api/user-products - 유저 ID ${userId} 없음`);
      return res.status(404).json({ message: `유저 ID ${userId}를 찾을 수 없습니다.` });
    }

    const allProducts = Object.values(goodsData).flat();
    const userProductIds = user.products || [];

    const userProducts = allProducts.filter(product => userProductIds.includes(product.id));

    log(`POST /api/user-products - 유저 ${userId}의 상품 ${userProducts.length}개 반환`);
    res.json(userProducts);
  } catch (error) {
    log("POST /api/user-products - 유저 상품 조회 실패: " + error.message);
    res.status(500).json({ message: "유저 상품 조회 실패" });
  }
});
// === 상품 삭제 API ===
app.delete("/api/delete-product/:id", (req, res) => {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    log("DELETE /api/delete-product - 유효하지 않은 상품 ID");
    return res.status(400).json({ message: "유효한 상품 ID가 필요합니다." });
  }

  try {
    // 1. 상품 데이터에서 삭제
    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));
    let found = false;

    for (const category in goodsData) {
      const originalLength = goodsData[category].length;
      goodsData[category] = goodsData[category].filter(p => p.id !== productId);
      if (goodsData[category].length !== originalLength) found = true;
    }

    if (!found) {
      log(`DELETE /api/delete-product - 상품 ID ${productId} 없음`);
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    // 2. 유저 데이터에서 해당 상품 ID 삭제
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    users.forEach(user => {
      if (Array.isArray(user.products)) {
        user.products = user.products.filter(id => id !== productId);
      }
      if (Array.isArray(user.likes_product)) {
        user.likes_product = user.likes_product.filter(id => id !== productId);
      }
    });

    // 3. 파일에 저장
    fs.writeFileSync(GOODS_PATH, JSON.stringify(goodsData, null, 2));
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

    log(`DELETE /api/delete-product - 상품 ID ${productId} 삭제 완료`);
    res.json({ success: true, message: "상품이 삭제되었습니다." });
  } catch (error) {
    log("DELETE /api/delete-product - 오류: " + error.message);
    res.status(500).json({ message: "서버 오류로 상품 삭제 실패" });
  }
});
// === 상품 등록 수정 ===
app.post("/api/add-product", (req, res) => {
  const { userId, id, name, description, category, imageUrl, price, picnum } = req.body;

  if (!userId || !name || !description || !category || !imageUrl || price === undefined) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  try {
    const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: `유저 ${userId}를 찾을 수 없습니다.` });
    }

    const user = users[userIndex];
    const finalPicnum = typeof picnum === "number" ? picnum : 5;

    // === 수정 모드 ===
    if (id) {
      const productId = parseInt(id, 10);
      let oldCategory = null;

      // 1. 기존 상품이 어느 카테고리에 있는지 찾기
      for (const key in goodsData) {
        if (goodsData[key].some(p => p.id === productId)) {
          oldCategory = key;
          break;
        }
      }

      if (!oldCategory) {
        return res.status(404).json({ message: "수정할 상품을 찾을 수 없습니다." });
      }

      // 2. 기존 카테고리에서 상품 삭제
      goodsData[oldCategory] = goodsData[oldCategory].filter(p => p.id !== productId);

      // 3. 새 카테고리에 상품 추가
      const updatedProduct = {
        id: productId,
        developer: userId,
        name,
        description,
        category,
        imageUrl,
        price: Number(price),
        picnum: finalPicnum,
      };

      if (!goodsData[category]) goodsData[category] = [];
      goodsData[category].push(updatedProduct);

      // 4. 유저 상품 목록에 상품 ID가 없으면 추가
      if (!user.products.includes(productId)) {
        user.products.push(productId);
      }

      // 5. 변경된 내용 저장
      fs.writeFileSync(GOODS_PATH, JSON.stringify(goodsData, null, 2));
      fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

      log(`POST /api/add-product - 상품 ID ${id} 수정 완료`);
      return res.json({ message: "상품 수정 완료", updated: true });
    }

    // === 등록 모드 ===
    const newId = (() => {
      const all = Object.values(goodsData).flat();
      return all.length > 0 ? Math.max(...all.map(p => p.id)) + 1 : 1;
    })();

    const newProduct = {
      id: newId,
      developer: userId,
      name,
      description,
      category,
      imageUrl,
      price: Number(price),
      picnum: finalPicnum,
    };

    if (!goodsData[category]) goodsData[category] = [];
    goodsData[category].push(newProduct);

    user.products.push(newId);

    fs.writeFileSync(GOODS_PATH, JSON.stringify(goodsData, null, 2));
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));

    log(`POST /api/add-product - 유저 ${userId}가 상품 ID ${newId} 등록`);
    res.status(201).json({ message: "상품 등록 완료", product: newProduct });
  } catch (error) {
    log("POST /api/add-product - 오류: " + error.message);
    res.status(500).json({ message: "서버 오류로 상품 등록/수정 실패" });
  }
});


// === 서버 실행 ===
app.listen(PORT, () => {
  log(`Server running on http://localhost:${PORT}`);
});
