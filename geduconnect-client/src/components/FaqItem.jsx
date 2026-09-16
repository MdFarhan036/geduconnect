import React, { useState } from "react";
// import faqimg from "../assets/faqimg.webp"; // Uncomment if needed

export const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => {
        console.log('Question clicked'); // Debugging line
        setIsOpen(!isOpen);
      }}>
        <h2>{question}</h2>
        <span className="toggle">{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && (
        <div className="faq-answer">
          <p className="faq-text">{answer.text}</p>
          {/* <ul className="faq-list">
            {answer.list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
};
