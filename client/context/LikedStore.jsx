// client/context/LikedStore.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const LikedContext = createContext();

export const useLikedStore = () => useContext(LikedContext);

export const LikedStoreProvider = ({ children }) => {
  const [likedIds, setLikedIds] = useState([]);

  // 서버에서 찜 목록 초기 로딩
  useEffect(() => {
    axios.get("http://localhost:3001/api/liked")
      .then((res) => {
        setLikedIds(res.data.liked);
      })
      .catch((err) => {
        console.error("찜 목록 불러오기 실패:", err);
      });
  }, []);

  // 토글 로직: liked 상태를 서버에 보냄
  const toggleLike = async (id) => {
    const isLiked = likedIds.includes(id);
    try {
      const res = await axios.post("http://localhost:3001/api/liked", {
        id,
        liked: !isLiked,
      });
      setLikedIds(res.data.liked);
    } catch (err) {
      console.error("찜 상태 업데이트 실패:", err);
    }
  };

  return (
    <LikedContext.Provider value={{ likedIds, toggleLike }}>
      {children}
    </LikedContext.Provider>
  );
};
