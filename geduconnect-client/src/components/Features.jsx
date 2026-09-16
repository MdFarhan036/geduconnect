import React from 'react'
import featureimg1 from "../assets/about-banner.png"
import featureimg2 from "../assets/about-banner.png"
import featureimg3 from "../assets/about-banner.png"
import featureimg4 from "../assets/about-banner.png"

export const Features = () => {
    return (
        <>
            <section className='features'>
                <div className='features-container'>
                    <div className='section-header'>
                        <h2>Why Choose Us?</h2>
                        <p>With over 20 years of experience in business consulting, we have a lot to offer to our clients. Here are some reasons why companies worldwide choose us.</p>
                    </div>

                    <div className='features-content'>

                        <div className='feature-card'>
                            <div className='feature-img'>

                                <img src={featureimg1} alt='Service Image' />
                            </div>
                            <div className='feature-description'>
                                <h2>Professional Design
                                </h2>
                                <p>Our services and solutions are built on business innovations</p>
                            </div>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={featureimg2} alt='Service Image' />
                            </div>
                            <div className='feature-description'>
                                <h2>Top-Notch Support</h2>
                                <p>Our services and solutions are built on business innovations</p>
                            </div>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={featureimg3} alt='Service Image' />
                            </div>
                            <div className='feature-description'>
                                <h2>Exclusive Assets</h2>
                                <p>Our services and solutions are built on business innovations</p>
                            </div>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-img'>
                                <img src={featureimg4} alt='Service Image' />
                            </div>
                            <div className='feature-description'>
                                <h2>Innovative Solution</h2>
                                <p>Our services and solutions are built on business innovations</p>
                            </div>
                        </div>

                    </div>

                </div>

            </section>
        </>
    )
}
