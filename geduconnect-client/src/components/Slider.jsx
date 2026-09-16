import React, { useState } from 'react'

export const Slider = ({ sliderimage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === sliderimage.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sliderimage.length - 1 : prevIndex - 1
        );
    };

    return (
        <>
            <div className="slider">
                <div className="slider-content">

                    {sliderimage.map((image, index) => (

                        <div
                            key={index}
                            className={index === currentIndex ? 'slide active' : 'slide'}
                        >
                            {index === currentIndex && (
                                <img src={image} alt={`slide ${index}`} />
                            )}
                        </div>

                    ))}
                </div>
                {/* <button className="prevbtn" onClick={prevSlide}>❮</button>
                <button className="nextbtn" onClick={nextSlide}>❯</button> */}
            </div >
           
        </>
    )
}
