import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './MyInfo.css'

const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) return <p>로그인이 필요합니다.</p>;
  return (
    <div>
      <button onClick={() => navigate(-1)}>뒤로가기</button>
      <div className="profile-card">
        <div className="profile-image"/>
        <div className="profile-info">
          <p className="profile-name">{user.name}</p>
          <p className="profile-intro">{user.introduction}</p>
        </div>
        <div className="profile-likes">
          <span className="heart">❤️</span>
          <span className="like-count">8</span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;