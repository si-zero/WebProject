const EventBannerCard = ({ banner }) => {
  return (
    <div className="event-banner-card">
      <img src={banner.image} alt={banner.title} />
      <div className="event-info">
      </div>
    </div>
  );
};

export default EventBannerCard;