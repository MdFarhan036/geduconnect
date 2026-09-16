// src/TestimonialCarousel.js

import React, { useState } from 'react';

const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-inner" style={{ transform: `translateX(-${currentIndex * 15}%)` }}>
        {testimonials.map((testimonial, index) => (
          <div className="testimonial-item" key={index}>
            <div className="testimonial-content">
              
              <p>{testimonial.quote}</p>
              <div className="quote">
                <i className="fa fa-quote-left"></i>
              </div>
              {/* <div className="ratings">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div> */}
              <div className="profile">
                <div className="profile-image">
                  <img src={testimonial.testiImg} />
                </div>
                <div className="profile-desc">
                  <span>{testimonial.author}</span>
                  <span>{testimonial.position}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-button prev" onClick={goToPrevious}>❮</button>
      <button className="carousel-button next" onClick={goToNext}>❯</button>
    </div>
  );
};

export default TestimonialCarousel;
