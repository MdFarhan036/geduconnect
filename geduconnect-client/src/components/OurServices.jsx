import React from 'react';

// Import the images
import serviceimag1 from '../assets/admission.png';
import serviceimag2 from '../assets/3d-printing-document.png';
import serviceimag3 from '../assets/erp.png';
import serviceimag4 from '../assets/consultant-services.png';
import serviceimag5 from '../assets/finance-and-business.png';
import serviceimag6 from '../assets/digital-marketing.png';
import serviceimag7 from '../assets/university.png';
import serviceimag8 from '../assets/call-center-service.png';
import { ServiceCard } from './ServiceCard';

// export const servicesCardData = [
//   {
//     id: 1,
//     serviceimage: serviceimag1,
//     cardtitle: "Escalate Admission",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
//   {
//     id: 2,
//     serviceimage: serviceimag2,
//     cardtitle: "Publications",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
//   {
//     id: 3,
//     serviceimage: serviceimag3,
//     cardtitle: "ERP's and CRM's",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
//   {
//     id: 4,
//     serviceimage: serviceimag4,
//     cardtitle: "Consultant Network",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
//   {
//     id: 5,
//     serviceimage: serviceimag5,
//     cardtitle: "Admissions Financing",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
//   {
//     id: 6,
//     serviceimage: serviceimag6,
//     cardtitle: "Lead Generation & Digital Marketing",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
//   {
//     id: 7,
//     serviceimage: serviceimag7,
//     cardtitle: "End-2-End University Management",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
//   {
//     id: 8,
//     serviceimage: serviceimag8,
//     cardtitle: "Admissions & BPO Management",
//     carddescription: "Nulla vitae elit libero, a pharetra augue. Donec id elit non mi porta gravida at eget metus cras justo.",
//   },
// ];

export const OurServices = () => {


  return (
    <>
      <section className="services" id="services">
        <div className='services-container'>
          <div className="section-header ">
            <h3>Services</h3>
            <h2>Check <span>Our</span> Services</h2>
            <p>We are offering the services to meet your needs.</p>
          </div>
          <div className="service-cont">
            <div className="card-container">
              {/* {servicesCardData.map(serviceitems => (
                <ServiceCard key={serviceitems.id} serviceitems={serviceitems} />
              ))} */}
              <ServiceCard servicelink="/escalateAdmissions" cardtitle="Escalate Admission" serviceimage={serviceimag1} />
              <ServiceCard servicelink="/ourPublications" cardtitle="Publications" serviceimage={serviceimag2} />
              <ServiceCard servicelink="/erpandCRM" cardtitle="ERP's and CRM's" serviceimage={serviceimag3} />
              <ServiceCard servicelink="/consultantNetwork" cardtitle="Consultant Network" serviceimage={serviceimag4} />
              <ServiceCard servicelink="/" cardtitle="Admissions Financing" serviceimage={serviceimag5} />
              <ServiceCard servicelink="/leadGenerationDigitalMarketing" cardtitle="Lead Generation & Digital Marketing" serviceimage={serviceimag6} />
              <ServiceCard servicelink="/endtoEndunivManagement" cardtitle="End-2-End Admission Management" serviceimage={serviceimag7} />
              <ServiceCard servicelink="/admissionsBPOManagement" cardtitle="Admissions & BPO Management" serviceimage={serviceimag8} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
