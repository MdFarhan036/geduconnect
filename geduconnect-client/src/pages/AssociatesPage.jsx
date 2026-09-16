import React from 'react'
import { associatepartnersData } from '../data'
import { AssociatePartners } from '../components/AssociatePartners'
import Carousel from "react-multi-carousel";
export const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 2000, min: 1000 },
        items: 4,
        slidesToSlide: 1,
    },
    desktop: {
        breakpoint: { max: 1000, min: 800 },
        items: 3,
    },
    tablet: {
        breakpoint: { max: 800, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2,
    },
};
export const AssociatesPage = () => {
    const associatepartnersproduct = associatepartnersData.map((item) => (
        <AssociatePartners key={item.id} item={item} />
    ));
    return (
        <div className="associate-partners">
            <div className="section-header ">
                <h3>NEWS AND BLOGS</h3>
                <h2>Our Corporate Networks</h2>
            </div>
            <Carousel responsive={responsive}>{associatepartnersproduct}</Carousel>
            <div className="associates-card">
                <div className="associates-img">
                    <img src={{}} alt="" />
                </div>
                <div className="associates-description">
                    <h3>fbfbfbgfb</h3>
                    <h4>vvsfdvd</h4>
                    <p>fvdfvd</p>
                    <span>vfdv</span>
                </div>
            </div>
        </div>
    )
}
