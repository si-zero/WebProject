import './EventBannerList.css'
import EventBannerCard from './EventBannerCard';

const EventBannerList = () => {
  const banners = [
    {
      id: 1,
      title: '매주 다양한 도트 리소스',
      sub_title: '다양한 상품 보기',
      image: '/EventBanner_1.png',
      backgroundColor: '#CDECFF',
    },
    {
      id: 2,
      title: '색깔별 리소스',
      sub_title: '다양한 상품 보기',
      image: '/EventBanner_2.png',
      backgroundColor: '#FFD2D2',
    },
    {
      id: 3,
      title: '주문제작',
      sub_title: '판매자분께 연락하기',
      image: '/EventBanner_3.png',
      backgroundColor: '#FFF28C',
    }
    // 필요 시 더 추가
  ];

  return (
    <div className="event-banner-list">
      {banners.map((banner) => (
        <EventBannerCard key={banner.id} banner={banner} />
      ))}
    </div>
  );
};

export default EventBannerList;