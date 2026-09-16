import React, { useState, useEffect } from 'react';
import './PartnersSlider.css';
import dbimg from '../assets/collegedunia.jpg';
import assim2 from '../assets/ctplofficial_logo.jpg';
import assimg3 from '../assets/profcyma.png';
import assimg4 from '../assets/usdcglobal.jpg';
import assimg5 from '../assets/db.jpeg';
import assimg6 from '../assets/rp.png'; import { motion } from 'framer-motion';
// import assimg7 from '../assets/db.jpeg';

const products = [
    { associatepartnersimage: dbimg },
    { associatepartnersimage: assim2 },
    { associatepartnersimage: assimg3 },
    { associatepartnersimage: assimg4 },
    { associatepartnersimage: assimg5 },
    { associatepartnersimage: assimg6 },
    // { associatepartnersimage: assimg7 },
];
export const AssociatePartners = () => {
    // Duplicate the slides for infinite scrolling
    const duplicatedPartnersData = [...products, ...products];

    return (
        <div className="partners">
            <div className="partners-container">
                <div className="section-header">
                    <h3>Our Industry Networks</h3>
                    {/* <p>We work with top Universities</p> */}
                </div>

                <div className="partners-area">
                    <div className="partners-inner">
                        <motion.div
                            className="partner-sliders"
                            style={{ display: 'flex', width: 'max-content' }} // 'max-content' allows seamless scrolling
                            animate={{
                                x: ['0%', '-100%'], // Move from 0% to -100% of the width
                            }}
                            transition={{
                                ease: 'linear',
                                duration: 20, // Control speed
                                repeat: Infinity, // Infinite loop
                            }}
                        >
                            {duplicatedPartnersData.map((partneritem, index) => (
                                <div
                                    key={index}
                                    className="partners-slider"
                                    style={{ flex: `0 0 ${100 / products.length}%` }} // Ensure correct width for each partner
                                >
                                    <div className="partners-slide">
                                        <div className="partnerslider-image">
                                            <img src={partneritem.associatepartnersimage} alt="Partner Logo" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};
