import React from "react";

export const ServiceCard = ({ service, onClick }) => {
  return (
    <div
      className="cards"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-img-wrap">
        {service.icon ? (
          <img src={service.icon} alt={service.title} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <div className="service-content">
        <h2>{service.title}</h2>
        <p>{service.subtitle}</p>

        <button className="learnmore">
          Learn More →
        </button>
      </div>
    </div>
  );
};
