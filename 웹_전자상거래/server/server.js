const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3001;

const FILE_PATH = path.join(__dirname, "data", "likedlist.json");
const GOODS_PATH = path.join(__dirname, "data", "goods.json");
const EVENTS_PATH = path.join(__dirname, "data", "event.json");

app.use(cors());
app.use(express.json());

// 로그 출력 함수
function log(message) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${message}`);
}

// 찜 목록 조회
app.get("/api/liked", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    log("GET /api/liked - 찜 목록 조회 성공");
    res.json(data);
  } catch (error) {
    log("GET /api/liked - 찜 목록 조회 실패: " + error.message);
    res.status(500).json({ message: "Failed to read likedlist.json" });
  }
});

// 찜 상태 업데이트 (추가/삭제)
app.post("/api/liked", (req, res) => {
  const { id, liked } = req.body;

  if (typeof id === "undefined" || typeof liked === "undefined") {
    log("POST /api/liked - 잘못된 요청: id 또는 liked 없음");
    return res.status(400).json({ message: "id and liked are required" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    let likedList = data.liked || [];

    if (liked) {
      if (!likedList.includes(id)) {
        likedList.push(id);
        log(`POST /api/liked - id ${id} 찜 추가`);
      } else {
        log(`POST /api/liked - id ${id} 이미 찜 목록에 있음`);
      }
    } else {
      if (likedList.includes(id)) {
        likedList = likedList.filter((item) => item !== id);
        log(`POST /api/liked - id ${id} 찜 해제`);
      } else {
        log(`POST /api/liked - id ${id} 찜 목록에 없음 (삭제 무시)`);
      }
    }

    fs.writeFileSync(FILE_PATH, JSON.stringify({ liked: likedList }, null, 2));
    res.json({ liked: likedList });
  } catch (error) {
    log("POST /api/liked - 찜 상태 업데이트 실패: " + error.message);
    res.status(500).json({ message: "Failed to update likedlist.json" });
  }
});

// 이벤트 전체 조회
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

// 상품 데이터 제공 (페이징 + 카테고리 필터 + hasMore)
app.get("/data/goods", (req, res) => {
  try {
    const { category, page = 1, limit = 5 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));

    let products = [];

    if (!category || category === "전체") {
      // 모든 카테고리 상품 합치기
      Object.values(goodsData).forEach(arr => {
        products = products.concat(arr);
      });
    } else {
      // 특정 카테고리 상품만 가져오기 (존재하지 않으면 빈 배열)
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

app.listen(PORT, () => {
  log(`Server running on http://localhost:${PORT}`);
});
// 찜한 상품만 조회
app.get("/api/liked-products", (req, res) => {
  try {
    const likedData = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
    const goodsData = JSON.parse(fs.readFileSync(GOODS_PATH, "utf-8"));

    const likedIds = likedData.liked || [];

    // 모든 상품을 하나의 배열로 합침
    const allProducts = Object.values(goodsData).flat();

    // 찜된 상품만 필터링
    const likedProducts = allProducts.filter((product) => likedIds.includes(product.id));

    log("GET /api/liked-products - 찜한 상품 조회 성공");

    res.json(likedProducts);
  } catch (error) {
    log("GET /api/liked-products - 찜한 상품 조회 실패: " + error.message);
    res.status(500).json({ message: "Failed to load liked products" });
  }
});