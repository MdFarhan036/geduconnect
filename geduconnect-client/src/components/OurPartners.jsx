import React from 'react';
import { motion } from 'framer-motion';
import "./PartnersSlider.css";
import vguimg from "../assets/1.png";
import mujimg from "../assets/2.png";
import buimg from "../assets/3.png";
import glaimg from "../assets/4.png";
import rbuimg from "../assets/5.png";
import jluimg from "../assets/6.png";
import parulimg from "../assets/7.png";
import cuimg from "../assets/8.png";
import uttarnchalimg from "../assets/uttaranchal-logo.jpg";
import sgvuimg from "../assets/9.png";
import jecrcimg from "../assets/10.png";
import jnuimg from "../assets/11.png";
import maharishiimg from "../assets/12.png";
import geetaimg from "../assets/13.png";
import lpuimg from "../assets/14.png";
import juimg from "../assets/15.png";
import invertisimg from "../assets/16.png";
import futureimg from "../assets/17.png";
import dpuimg from "../assets/DPU-COL.png";
import shardaimg from "../assets/18.png";
import smuimg from "../assets/19.png";
import smuimg1 from "../assets/20.png";
import smuimg2 from "../assets/21.png";
import smuimg3 from "../assets/22.png";

export const partnersslides = [
    { partnerImg: vguimg },
    { partnerImg: mujimg },
    { partnerImg: glaimg },
    { partnerImg: buimg },
    { partnerImg: rbuimg },
    { partnerImg: jluimg },
    { partnerImg: parulimg },
    { partnerImg: cuimg },
    { partnerImg: shardaimg },
    { partnerImg: lpuimg },
    { partnerImg: sgvuimg },
    { partnerImg: jecrcimg },
    { partnerImg: jnuimg },
    { partnerImg: maharishiimg },
    { partnerImg: geetaimg },
    { partnerImg: juimg },
    { partnerImg: invertisimg },
    { partnerImg: futureimg },
    { partnerImg: smuimg },
    { partnerImg: smuimg1 },
    { partnerImg: smuimg2 },
    { partnerImg: smuimg3 },
];

export const OurPartners = () => {
    // Duplicate the slides for infinite scrolling
    const duplicatedPartnersData = [...partnersslides, ...partnersslides];

    return (
        <div className="partners">
            <div className="partners-container">
                <div className="section-header">
                    <h3>Our Clients</h3>
                    <p>We work with top Universities</p>
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
                                duration: 50, // Control speed
                                repeat: Infinity, // Infinite loop
                            }}
                        >
                            {duplicatedPartnersData.map((partneritem, index) => (
                                <div
                                    key={index}
                                    className="partners-slider"
                                    style={{ flex: `0 0 ${100 / partnersslides.length}%` }} // Ensure correct width for each partner
                                >
                                    <div className="partners-slide">
                                        <div className="partnerslider-image">
                                            <img src={partneritem.partnerImg} alt="Partner Logo" />
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
