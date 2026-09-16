import React from 'react';

import { motion } from 'framer-motion';

export const PartnersSlider = () => {
    const duplicatedpartnersdata = [...partnersslides, ...partnersslides];

    return (
        <div className='partners'>
            <div className='partners-container'>
                <div className="section-header ">
                    <h3>OUR PARTNERS</h3>
                    <h2>We work with top Universities</h2>
                </div>

                <div className='partners-area'>

                    <div className="partners-inner">
                        <motion.div
                            className="flex"
                            animate={{
                                x: ['0%', '-100%'],
                                transition: {
                                    ease: 'linear',
                                    duration: 90,
                                    repeat: Infinity,
                                }
                            }}
                        >
                            {duplicatedpartnersdata.map((partneritem, index) => (
                                <div key={index} className="partners-slider" style={{ width: `${100 / partnersdata.length}%` }}>
                                    <div className="partners-slide">
                                        <div className='partnerslider-image'>

                                            <img src={partneritem.image} alt='Slider Image' />


                                        </div>
                                    </div>

                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
