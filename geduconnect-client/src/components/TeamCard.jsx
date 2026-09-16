import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const TeamCard = ({ teams }) => {
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
        <div className="team-carousel">
            <div className="team-inner" style={{ transform: `translateX(-${currentIndex * 10}%)` }}>
                {teams.map((team, index) => (
                    <div className="team-item" key={index}>

                        <img src={team.teamimg} alt='team image' />

                        <div className="team-content">
                            <p>{team.name}</p>
                            <h4>{team.position}</h4>

                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-button prev" onClick={goToPrevious}>❮</button>
            <button className="carousel-button next" onClick={goToNext}>❯</button>
        </div>
    )
}
