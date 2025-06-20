import React, { useEffect, useState } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/orders") // 필요시 userId 추가
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <h2>최근 주문내역</h2>
      <table>
        <thead>
          <tr>
            <th>결제번호</th>
            <th>상품명</th>
            <th>결제수단</th>
            <th>금액</th>
            <th>일자</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.paymentId}</td>
              <td>{order.name}</td>
              <td>{order.method}</td>
              <td>{order.amount.toLocaleString()}원</td>
              <td>{order.date}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
