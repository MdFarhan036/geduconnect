import React from "react";
import publicationsimg from "../assets/publicationsimage.webp";
import publicationimage2 from "../assets/standee.png";
import publicationimage3 from "../assets/brochure.png";
import publicationimage5 from "../assets/banner.png";
import publicationimage4 from "../assets/pamphlets.png";
import publicationimage1 from "../assets/open-book.png";
import publicationimage6 from "../assets/visiting-card.png";
import brochureimg from "../assets/IMG_20241016_171706.jpg";
import posterImg from "../assets/poster-IMAGE.png";
import PamphletsImg from "../assets/posters.png";
import pubimg1 from "../assets/book-magazine-catalog-production-line-into-press-plant-house.webp";
export const publicationCardData = [
  {
    id: 1,
    publicationimage: publicationimage1,
  },
  {
    id: 2,
    publicationimage: publicationimage2,
  },
  {
    id: 3,
    publicationimage: publicationimage3,
  },
  {
    id: 4,
    publicationimage: publicationimage4,
  },
  {
    id: 5,
    publicationimage: publicationimage5,
  },
  {
    id: 6,
    publicationimage: publicationimage6,
  },
];

export const OurPublications = () => {
  return (
    <>
      <div className="main-container">
        <div
          className="inner-hero"
          data-aos="fade-in"
          data-duration="0"
        >
          <div className="inner-hero-left adminsion-hero-left">
            <h1 className="hero-title-txt">
              Our <span className="highlighter">Publications</span>
            </h1>
            <div className="comm-para">
              <p>
                Welcome to our Publications Hub, where we bring you insightful and impactful content designed to inform, inspire, and innovate. Our diverse range of publications spans [list the areas/topics], reflecting our commitment to excellence and thought leadership.
              </p>
            </div>
          </div>

          <div className="inner-hero-right">
            <img src={publicationsimg} alt="" />
          </div>
        </div>
      </div>
      <div className="publications-container">
        <div className="section-header ">
          <h3>PUBLICATION CATEGORIES</h3>
          <p>We are offering the publications to meet your needs.</p>
        </div>
        <div className="publications-cont">
          <div className="pub-container">
            <div className="publications-card">
              <div className="pub-img">
                <img src={publicationimage1} alt="publications Image" />
              </div>

              <h3 alt="Service Title">Textbooks</h3>
            </div>

            <div className="publications-card">
              <div className="pub-img">
                <img src={publicationimage2} alt="publications Image" />
              </div>

              <h3 alt="Service Title">Brochures</h3>
            </div>

            <div className="publications-card">
              <div className="pub-img">
                <img src={publicationimage3} alt="publications Image" />
              </div>

              <h3 alt="Service Title">Banners</h3>
            </div>

            <div className="publications-card">
              <div className="pub-img">
                <img src={publicationimage4} alt="publications Image" />
              </div>

              <h3 alt="Service Title">Standee</h3>
            </div>

            <div className="publications-card">
              <div className="pub-img">
                <img src={publicationimage5} alt="publications Image" />
              </div>

              <h3 alt="Service Title">Pamphlets</h3>
            </div>

            <div className="publications-card">
              <div className="pub-img">
                <img src={publicationimage6} alt="publications Image" />
              </div>

              <h3 alt="Service Title">Visiting Cards</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="about-container">
        <div className="about-div1">
          <div className="content-div1">
            <h3>About Our Publications</h3>
            <p>
              Welcome to Our Publucations, a place where stories come to life
              and ideas take flight. Established with the mission of nurturing
              creativity and promoting knowledge, we are committed to delivering
              a diverse range of high-quality books across multiple genres. From
              captivating fiction to insightful non-fiction, academic research
              to self-help guides, our publications are crafted to inspire,
              educate, and entertain readers of all ages.
            </p>
            <p>
              At Our Publications, we believe in the transformative power of
              books. Our journey began with a passion for storytelling and a
              desire to bring new voices and fresh perspectives into the
              literary world. Over the years, we have collaborated with emerging
              authors, seasoned writers, and subject-matter experts to create a
              wide array of publications that resonate with readers around the
              globe.
            </p>
            {/* <Link to={{}} className="btn-readmore">Book a Meeting</Link> */}
          </div>
          <div className="img-div1">
            <img src={pubimg1} alt="about image1" />
          </div>
        </div>
      </div>
      <div className="publications-container">
        <div className="section-header ">
          <h3>Our Publications</h3>
        </div>
        <div className="publications-cont">
          <div className="pub-container">
            <div className="published-card">
              <div className="published-img">
                <img src={posterImg} alt="publications Image" />
              </div>
              <div className="services-content">
                <h3 alt="Service Title">VGU TEXTBOOKS</h3>
              </div>
            </div>
            {/* <div className="published-card">
              <div className="published-img">
                <img src={publicationimage1} alt="publications Image" />
              </div>
              <div className="services-content">
                <h3 alt="Service Title">JNU TEXTBOOKS</h3>
              </div>
            </div> */}
            <div className="published-card">
              <div className="published-img">
                <img src={PamphletsImg} alt="publications Image" />
              </div>
              <div className="services-content">
                <h3 alt="Service Title">Pamphlets</h3>
              </div>
            </div>
            <div className="published-card">
              <div className="published-img">
                <img src={brochureimg} alt="publications Image" />
              </div>
              <div className="services-content">
                <h3 alt="Service Title">Brochures</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
