import React from 'react';
import './EventBanner.css';

const EventBanner = ({ event }) => {
  const bannerStyle = {
    backgroundColor: event.backgroundColor || '#cce4ff' // 배경색 동적 처리
  };

  return (
    <div className="event-banner" style={bannerStyle}>
      <div className="banner-image-container">
        <img src={event.imageUrl} alt={event.title} className="banner-image" />
      </div>
      <div className="banner-text">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
      </div>
    </div>
  );
};

export default EventBanner;
