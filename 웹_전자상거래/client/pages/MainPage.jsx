/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import EventBanner from "../components/EventBanner";
import ProductCard from "../components/ProductCard";
import "./MainPage.css";

function MainPage() {
  const EVENT_PAGE_SIZE = 3;
  const MAX_EVENT_PAGES = 2;
  const PRODUCT_PAGE_SIZE = 6;
  const MAX_PRODUCT_PAGES = 4;

  const [events, setEvents] = useState([]);
  const [eventPage, setEventPage] = useState(0);

  const categories = ["스크립트", "아이템", "코드", "리소스"];
  const [productsByCategory, setProductsByCategory] = useState(
    categories.reduce((acc, cat) => {
      acc[cat] = { pages: {}, total: 0, hasMore: true };
      return acc;
    }, {})
  );
  const [pagesByCategory, setPagesByCategory] = useState(
    categories.reduce((acc, cat) => {
      acc[cat] = 1;
      return acc;
    }, {})
  );

  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  // ✅ 이벤트 순차 로딩 (hasMore 없이 slice 기반 판단)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/events");
        const data = await res.json();

        if (Array.isArray(data)) {
          const result = [];
          const maxCount = EVENT_PAGE_SIZE * MAX_EVENT_PAGES;
          for (let i = 0; i < maxCount; i++) {
            if (i >= data.length) break;
            result.push(data[i]);
          }
          setEvents(result);
        }
      } catch (err) {
        console.error("이벤트 fetch 실패:", err);
        setEvents([]);
      }
    };
    loadEvents();
  }, []);

  // ✅ 상품 카테고리별 순차 로딩 (hasMore 검사)
  useEffect(() => {
    const loadAllCategoryProducts = async () => {
      const newState = { ...productsByCategory };

      for (const category of categoriesRef.current) {
        let hasMore = true;
        for (let page = 1; page <= MAX_PRODUCT_PAGES; page++) {
          if (!hasMore) break;
          if (newState[category].pages[page]) continue;

          try {
            const res = await fetch(
              `http://localhost:3001/data/goods?category=${encodeURIComponent(
                category
              )}&page=${page}&limit=${PRODUCT_PAGE_SIZE}`
            );
            const data = await res.json();
            newState[category].pages[page] = data.products || [];
            newState[category].total = data.total || 0;
            newState[category].hasMore = data.hasMore;
            hasMore = data.hasMore;
          } catch (err) {
            console.error(`상품 fetch 실패 - ${category} 페이지 ${page}`, err);
            newState[category].pages[page] = [];
            newState[category].hasMore = false;
            break;
          }
        }
      }

      setProductsByCategory(newState);
    };

    loadAllCategoryProducts();
  }, []);

  const eventPageCount = Math.ceil(events.length / EVENT_PAGE_SIZE);
  const currentEvents = events.slice(
    eventPage * EVENT_PAGE_SIZE,
    (eventPage + 1) * EVENT_PAGE_SIZE
  );

  const changeEventPage = (delta) => {
    setEventPage((prev) =>
      Math.max(0, Math.min(prev + delta, eventPageCount - 1))
    );
  };

  const changeProductPage = (category, delta) => {
    setPagesByCategory((prev) => {
      const oldPage = prev[category];
      const total = productsByCategory[category]?.total || 0;
      const maxPage = Math.min(
        Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE)),
        MAX_PRODUCT_PAGES
      );
      const newPage = Math.min(maxPage, Math.max(1, oldPage + delta));
      if (newPage === oldPage) return prev;
      return { ...prev, [category]: newPage };
    });
  };

  const fillEmpty = (array, size, EmptyComponent) => {
    const filled = [...array];
    while (filled.length < size) {
      filled.push(<EmptyComponent key={`empty-${filled.length}`} />);
    }
    return filled;
  };

  const EmptyEvent = () => <div className="event-banner empty" />;
  const EmptyProduct = () => <div className="product-card empty" />;

  return (
    <>
      <Header />
      <SearchBar />
      <div id="root">
        {/* 이벤트 섹션 */}
        <h2>이벤트 배너</h2>
        <div className="carousel-container">
          <button
            className={`left-button ${eventPage > 0 ? "active" : ""}`}
            disabled={eventPage === 0}
            onClick={() => changeEventPage(-1)}
            aria-label="이벤트 이전"
          >
            &#10094;
          </button>
          <div className="carousel">
            {fillEmpty(
              currentEvents.map((event, idx) => (
                <EventBanner key={idx} event={event} />
              )),
              EVENT_PAGE_SIZE,
              EmptyEvent
            )}
          </div>
          <button
            className={`right-button ${
              eventPage < eventPageCount - 1 ? "active" : ""
            }`}
            disabled={eventPage === eventPageCount - 1}
            onClick={() => changeEventPage(1)}
            aria-label="이벤트 다음"
          >
            &#10095;
          </button>
        </div>

        {/* 상품 섹션 */}
        {categories.map((category) => {
          const page = pagesByCategory[category];
          const { pages, total } = productsByCategory[category] || {};
          const products = (pages && pages[page]) || [];
          const pageCount = Math.min(
            Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE)),
            MAX_PRODUCT_PAGES
          );

          return (
            <section key={category}>
              <h2>{category}</h2>
              <div className="carousel-container">
                <button
                  className={`left-button ${page > 1 ? "active" : ""}`}
                  disabled={page === 1}
                  onClick={() => changeProductPage(category, -1)}
                  aria-label={`${category} 이전`}
                >
                  &#10094;
                </button>
                <div className="carousel">
                  {fillEmpty(
                    products.map((product, idx) => (
                      <ProductCard key={idx} product={product} />
                    )),
                    PRODUCT_PAGE_SIZE,
                    EmptyProduct
                  )}
                </div>
                <button
                  className={`right-button ${page < pageCount ? "active" : ""}`}
                  disabled={page === pageCount}
                  onClick={() => changeProductPage(category, 1)}
                  aria-label={`${category} 다음`}
                >
                  &#10095;
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

export default MainPage;
