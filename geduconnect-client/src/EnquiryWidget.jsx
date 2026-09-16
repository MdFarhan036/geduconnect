import React, { useEffect, useState } from "react";

export const EnquiryWidget = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    university: '',
    course: '',
    cmp: 'marketing_csp',
    source: '59',
    level: '2',
    country_code: '+91',
    department: '',
    center: '',
    category: '5',
    nationality: '1',
    ProspectID: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You may want to handle this with fetch/Axios instead of default form submit
    // For now, just console.log the formData
    console.log(formData);
    e.target.submit(); // If you still want native form submit
  };

  return (
    <div className="appointmentForm">
      <h2>Enquiry Form</h2>
      <form
        id="form"
        action="https://cspm.geduconnect.in/api/enquery-now"
        method="post"
        className="appform"
        onSubmit={handleSubmit}
      >
        {/* Hidden Inputs */}
        <input type="hidden" name="cmp" value={formData.cmp} />
        <input type="hidden" name="source" value={formData.source} />
        <input type="hidden" name="level" value={formData.level} />
        <input type="hidden" name="country_code" value={formData.country_code} />
        <input type="hidden" name="department" value={formData.department} />
        <input type="hidden" name="center" value={formData.center} />
        <input type="hidden" name="category" value={formData.category} />
        <input type="hidden" name="nationality" value={formData.nationality} />
        <input type="hidden" name="ProspectID" value={formData.ProspectID} />

        {/* Name */}
        <div className="input-container">
          <i className="material-symbols-outlined icon" style={{ fontSize: 20 }}>person</i>
          <input
            className="input-field"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            pattern="[A-Za-z ]+"
            required
          />
        </div>

        {/* Email */}
        <div className="input-container">
          <i className="material-symbols-outlined icon" style={{ fontSize: 20 }}>mail</i>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.\-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*"
            required
          />
        </div>

        {/* Mobile */}
        <div className="input-container">
          <i className="material-symbols-outlined icon" style={{ fontSize: 20 }}>call</i>
          <input
            className="input-field"
            type="tel"
            name="mobile"
            placeholder="Mob."
            value={formData.mobile}
            onChange={handleChange}
            pattern="[6789][0-9]{9}"
            maxLength="10"
            required
          />
        </div>

        {/* State */}
        <div className="input-container">
          <i className="material-symbols-outlined icon" style={{ fontSize: 20 }}>pin_drop</i>
          <select
            className="select2search input-field"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Choose state</option>
            {/* Add state options here */}
          </select>
        </div>

        {/* City */}
        <div className="input-container">
          <i className="material-symbols-outlined icon" style={{ fontSize: 20 }}>location_city</i>
          <select
            className="select2search input-field"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Choose city</option>
            {/* Add city options here */}
          </select>
        </div>

        {/* University */}
        <div className="input-container" id="services">
          <div className="service_Heading">
            <i className="fa fa-university icon" style={{ fontSize: 20 }}></i>
            <select
              className="form-select"
              name="university"
              value={formData.university}
              onChange={handleChange}
              required
            >
              <option value="">--Select A university--</option>
              {/* Add university options here */}
            </select>
          </div>
        </div>

        {/* Course */}
        <div className="input-container" id="services">
          <div className="service_Heading">
            <i className="material-symbols-outlined icon" style={{ fontSize: 20 }}>Mode</i>
            <select
              className="select2search form-control"
              name="odlcourse"
              value={formData.course}
              onChange={(e) => {
                const selected = e.target.options[e.target.selectedIndex];
                setFormData(prev => ({
                  ...prev,
                  course: selected.value,
                  level: selected.getAttribute('data-level') || prev.level,
                  department: selected.getAttribute('data-dept') || prev.department
                }));
              }}
              required
            >
              <option value="">--Select Course--</option>
              {/* Add course options with data-level and data-dept attributes */}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button id="submit" className="formSubmitButton" type="submit">
          BOOK SLOT
        </button>
      </form>
    </div>
  );
};
