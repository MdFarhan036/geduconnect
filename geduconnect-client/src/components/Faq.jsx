import { FaqItem } from "./FaqItem";
import faqimg from "../assets/faqimg.webp";

export const Faq = () => {
  const faqData = [
    {
      question: "How does G Educonnect streamline the admissions process?",
      answer: {
        text: "G Educonnect automates and simplifies the admissions workflow, reducing paperwork and administrative tasks, allowing your team to focus on engaging with prospective students.",
       
      },
    },
    {
      question: "What benefits can we expect in terms of enrollment numbers?",
      answer: {
        text: "Our targeted outreach strategies and user-friendly platform enhance your visibility to potential students, leading to increased applications and higher enrollment rates.",
       
      },
    },
    {
      question: "Can G Educonnect integrate with our existing systems?",
      answer: {
        text: "Yes, G Educonnect is designed to easily integrate with various university management systems, ensuring a seamless transition and minimal disruption to your operations.",
        
      },
    },
    {
      question: "How does G Educonnect support student engagement?",
      answer: {
        text: "We provide personalized guidance and support throughout the admissions process, enhancing the student experience and fostering a stronger connection with your institution.",
      
      },
    },
    {
      question: "What data and analytics does G Educonnect provide?",
      answer: {
        text: "Our platform offers insightful analytics on application trends, student demographics, and conversion rates, empowering you to make informed decisions for recruitment strategies.",
       
      },
    },
    {
      question: "Is training provided for our staff?",
      answer: {
        text: "Absolutely! We offer comprehensive training and ongoing support to ensure your team is fully equipped to utilize the platform effectively.",
        
      },
    },
    {
      question: "How do we ensure data security with G Educonnect?",
      answer: {
        text: "We prioritize data security and compliance, implementing robust measures to protect sensitive information and ensure a safe experience for both institutions and students.",
       
      },
    },
    {
      question: "What is the cost structure for partnering with G Educonnect?",
      answer: {
        text: "We offer flexible pricing models tailored to your institution's needs. Our team can provide a detailed proposal based on your specific requirements.",
       
      },
    },
  ];

  return (
    <div className="faq">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-container">
        <div className="img-faq">
          {/* Uncomment if you have an image */}
          <img className="about-shape" src={faqimg} alt="shape" />
        </div>
        <div className="faqtab">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
