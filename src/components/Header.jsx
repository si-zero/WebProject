import "./Header.css";
import { useEffect, useState } from "react";
function Header() {
  const [dateVar, setDateVar] = useState(new Date().toLocaleString());
  useEffect(() => {
    const intervalVar = setInterval(() => {
      setDateVar(new Date().toLocaleString());
    }, 1000);
    return () => {
      clearInterval(intervalVar);
    };
  }, []);
  return (
    <div className="Header">
      <h3> 오늘은 🗓️ </h3>
      <h1> {dateVar} </h1>
    </div>
  );
}
export default Header;
