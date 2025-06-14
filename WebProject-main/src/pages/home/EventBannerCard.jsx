import './EventBannerCard.css'

const EventBannerCard = ({ banner }) => {
  return (
    <div className="event-banner-card" style={{ backgroundColor: banner.backgroundColor }}>
      <img src={banner.image} alt={banner.title} />
      <div className="banner-text">
        <p className="banner-title">{banner.title}</p>
        <p className="banner-sub_title">{banner.sub_title}</p>
      </div>
    </div>
  );
};

export default EventBannerCard;