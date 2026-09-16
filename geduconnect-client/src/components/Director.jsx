import React from 'react'
import directorsimage from "../assets/founder-image.jpg"
export const Director = () => {
    return (
        <>
            <div className="directormessage">
                <div className="director-container">

                    <div className="director-content">

                        <div className="section-headers" style={{ textAlign: "left" }}>
                            <h3>
                                From Our Founder's Desk
                            </h3>

                        </div>
                        <div className="line-maf"></div>

                        <p>

                            <b>Dear Partners,</b>
                            <br />
                            <br />
                            Welcome to Geduconnect, where we believe that education has the power to transform lives and shape the future.


                            As a passionate learner for accessible and inclusive education, I founded Geduconnect with a singular mission: to bridge the gap between aspiration and opportunity.

                            Our goal is to empower students, educators, and institutions with the tools, resources, and connections they need to succeed in an ever-evolving world.

                            At Geduconnect, we're committed to fostering a community that values curiosity, creativity, and critical thinking. We believe that education should be a catalyst for growth, innovation, and positive change.

                            As we embark on this journey together, I invite you to join us in our pursuit of excellence and our passion for education. Let's connect, collaborate, and create a brighter future for all.
                            <br />
                            <br />
                            Thank you for being part of the Geduconnect community.
                            <br />
                            <br />
                            Sandeep Sharma
                            <br />

                            <b>CEO & Founder, Geduconnect</b>
                            </p>


                    </div>
                    <div className="director-image">
                        <img src={directorsimage} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}
