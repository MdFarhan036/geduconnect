import React from 'react';

const benefits = [
  { id: 1, benefit: 'Competitive Salary' },
  { id: 2, benefit: 'Health Insurance' },
  { id: 3, benefit: 'Work from Anywhere' },
  { id: 4, benefit: 'Flexible Working Hours' },
  { id: 5, benefit: 'Learning and Development' },
];

const BenefitsSection = () => {
  return (
    <div className="benefits-container">
      {benefits.map((benefit) => (
        <div key={benefit.id} className="benefit-item">
          <h3>{benefit.benefit}</h3>
        </div>
      ))}
    </div>
  );
};

export default BenefitsSection;
