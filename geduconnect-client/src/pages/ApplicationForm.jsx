import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    cv: '',
  });
  const [file, setFile] = useState(null); // To hold the CV file
  const form = useRef();

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change (CV file)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture the uploaded file
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object to handle file attachments
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("position", formData.position);
    formDataToSend.append("cv", file); // Attach the CV file

    // Send the form data with emailjs using the send method
    emailjs.send(
      'service_w3ta6tb', // Replace with your Service ID
      'template_dhu82z8', // Replace with your Template ID
      formDataToSend,     // The FormData object with attached file
      'pLHwsYzqBjW-iOu4f' // Replace with your User ID
    ).then(
      (response) => {
        console.log('Success:', response);
        alert('Application submitted successfully!');
        setFormData({ name: '', email: '', phone: '', position: '' }); // Reset form
        setFile(null); // Reset file input
      },
      (error) => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
      }
    );
  };

  return (
    <form className="application-form" ref={form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Mobile Number"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        name="cv"
        id="cv"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        required
      />
      <button type="submit" className="submit-btn">
        Submit Application
      </button>
    </form>
  );
};

export default ApplicationForm;
