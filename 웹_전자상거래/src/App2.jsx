import React, { useState } from "react";
import data from "./data/goods.json";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import EventBanner from "./components/EventBanner";
import ProductCard from "./components/ProductCard";
import "./App.css";

function App() {
  const { events, products } = data;

  const eventPageSize = 3;
  const productPageSize = 6;

  const [eventPage, setEventPage] = useState(0);
  const [productPage, setProductPage] = useState(0);

  const eventPageCount = Math.ceil(events.length / eventPageSize);
  const productPageCount = Math.ceil(products.length / productPageSize);

  const changeEventPage = (delta) => {
    setEventPage((prev) =>
      Math.max(0, Math.min(prev + delta, eventPageCount - 1))
    );
  };

  const changeProductPage = (delta) => {
    setProductPage((prev) =>
      Math.max(0, Math.min(prev + delta, productPageCount - 1))
    );
  };

  // eslint-disable-next-line no-unused-vars
  const fillEmpty = (array, size, EmptyComponent) => {
    const filled = [...array];
    while (filled.length < size) {
      filled.push(<EmptyComponent key={`empty-${filled.length}`} />);
    }
    return filled;
  };

  const EmptyEvent = () => <div className="event-banner empty" />;
  const EmptyProduct = () => <div className="product-card empty" />;

  const currentEvents = events.slice(
    eventPage * eventPageSize,
    (eventPage + 1) * eventPageSize
  );
  const currentProducts = products.slice(
    productPage * productPageSize,
    (productPage + 1) * productPageSize
  );

  return (
    <>
      <Header />
      <SearchBar />
      <div id="root">
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
              eventPageSize,
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

        <h2>상품 목록</h2>
        <div className="carousel-container">
          <button
            className={`left-button ${productPage > 0 ? "active" : ""}`}
            disabled={productPage === 0}
            onClick={() => changeProductPage(-1)}
            aria-label="상품 이전"
          >
            &#10094;
          </button>
          <div className="carousel">
            {fillEmpty(
              currentProducts.map((product, idx) => (
                <ProductCard key={idx} product={product} />
              )),
              productPageSize,
              EmptyProduct
            )}
          </div>
          <button
            className={`right-button ${
              productPage < productPageCount - 1 ? "active" : ""
            }`}
            disabled={productPage === productPageCount - 1}
            onClick={() => changeProductPage(1)}
            aria-label="상품 다음"
          >
            &#10095;
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
