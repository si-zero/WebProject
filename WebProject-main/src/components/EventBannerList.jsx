import './EventBannerList.css'
import EventBannerCard from './EventBannerCard';

const EventBannerList = () => {
  const banners = [
    {
      id: 1,
      title: '여름맞이 할인',
      description: '최대 50% 할인!',
      image: 'src/assets/EventBanner_1.png',
    },
    {
      id: 2,
      title: '신상품 입고!',
      description: '지금 바로 확인하세요.',
      image: 'src/assets/EventBanner_2.png',
    },
    {
      id: 3,
      title: '신상품 입고',
      description: '지금 바로 확인하세요.',
      image: 'src/assets/EventBanner_3.png',
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