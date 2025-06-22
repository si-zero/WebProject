import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 다른 컴포넌트에서 사용하기 위한 헬퍼
// user와 setUser 변수를 전역변수로 설정
export const useUser = () => useContext(UserContext);