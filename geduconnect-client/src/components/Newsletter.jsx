import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser';

export const Newsletter = () => {
    const [newValue, setNewValue] = useState(false);
    const [status, setStatus] = useState(''); // Added state to handle status message
    const [newsletterdata, setNewsletterdata] = useState({
        email: "",
    })
    const newsletterform = useRef();
    const handleInputs = (e) => {
        const { name, value } = e.target;
        setNewsletterdata((prev) => ({ ...prev, [name]: value }));

        // Update the character count for the message field

    };

    const formSubmit = (e) => {
        e.preventDefault();
        console.log(newsletterdata);
        setStatus('Sending message...');
        emailjs.sendForm(
            'service_w3ta6tb', // Replace with your Service ID
            'template_f0o23dc', // Replace with your Template ID
            newsletterform.current, // Reference to the form
            'pLHwsYzqBjW-iOu4f' // Replace with your User ID
        )
            .then(
                (response) => {
                    console.log('Success:', response);
                    alert('Message sent successfully!');
                    setStatus(''); // Reset status message

                    // Clear form data
                    setNewsletterdata({

                        email: '',

                    });

                },
                (error) => {
                    console.log('Error:', error);
                    alert('Something went wrong. Please try again.');
                    setStatus('Error sending message. Please try again.'); // Set error message
                }
            );
    };
    console.log(newValue);
    // const PostData = async (e) => {
    //     e.preventDefault();

    //     const { email } = newsletterdata;

    //     const res = await fetch("/newsletter", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //             email,

    //         })
    //     });
    //     const data = await res.json();

    //     if (data.status === 422 || !data) {
    //         window.alert("Invalid Data")
    //         console.log("Invalid Data");
    //     }
    //     else {
    //         window.alert("Registration SuccessfUll")
    //         console.log("Registration SuccessfUll");
    //     }
    // };
    return (
        <>
            {/* <div className="NewsLetterBox"><div className="container"><div className="NewsLetter"><div className="NewsLetterTitle"><h6>GO AT YOUR OWN PACE</h6><h2>Subscribe to Our Newsletter</h2><p>Explore all of our courses and pick your suitable ones to enroll and start learning with us! We ensure that you will never regret it!</p><div className="NewsEmail"><input type="email" placeholder="Enter Your Email Address..." /><div className="NewsBtn"><button type="button" className="btn-box-common btn btn-primary">Subscribe Now</button></div></div></div></div></div></div> */}
            <div className="newsletter" id='newsletter'>
                <div className="newsletter-container">
                    <div className="newsletter-content">
                        <div className="section-header">
                            <h3>NEWSLETTER</h3>
                            <h2>Subscribe to our Newsletter & get latest update...</h2>
                        </div>
                        <div className="newsletter-box">
                            <form action="" className="news-letter-form" ref={newsletterform} onSubmit={formSubmit} method="POST">
                                <input id="mc-email" className="form-control" type="email"
                                    name="email"
                                    autoComplete="off"
                                    value={newsletterdata.email}
                                    onChange={handleInputs}
                                    required
                                    placeholder="Enter your Email"
                                />
                                <button className="search-btn" type="submit">Subscribe</button>
                            </form>
                            {status && <p>{status}</p>} {/* Display status message */}
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}
