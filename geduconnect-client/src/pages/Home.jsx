import React from 'react'
import "../components/Components.css"
import { Features } from '../components/Features'


import { Banner } from '../components/Banner'
import { OurPartners } from '../components/OurPartners'

import { AssociatePartners } from '../components/AssociatePartners'
import { Newsletter } from '../components/Newsletter'

import { LeadGenerationDigitalMarketing } from '../components/LeadGenerationDigitalMarketing'

import { Director } from '../components/Director'
import HomeCarousel from './HomeCarousel'
import About from '../components/About'
import Highlights from '../components/Highlights'
import WhyChooseUs from './WhyChooseUs'
import Clients from './Clients'
import Faqs from '../components/Faqs'
// import { ERPandCRM } from '../components/ERPandCRM'  
// import { EscalateAdmissions } from '../components/EscalateAdmissions'
// import { OurPublications } from '../components/OurPublications'
import "./Home.css"
import { Services } from '../components/Services'
import HomeTestimonials from './HomeTestimonials'
import HeroCarousel from './HeroCarousel'
import JourneyPage from './JourneyPage'
export const Home = () => {
  // const images = [
  //   'https://via.placeholder.com/600x400?text=Image+1',
  //   'https://via.placeholder.com/600x400?text=Image+2',
  //   'https://via.placeholder.com/600x400?text=Image+3',

  // ];



  return (
    <>
      {/* <HomeCarousel /> */}
      <HeroCarousel />
      <About variant="home" />
      <Highlights />
      <Clients />
      <Services />
      <JourneyPage />

      <WhyChooseUs />
      {/* <Features /> */}
      {/* <Director /> */}
      {/* <PartnersSlider /> */}
      {/* <Testimonials /> */}
      

      <HomeTestimonials />
      

      {/* <ERPandCRM /> */}
      {/* <ConsultantNetwork /> */}
      {/* <LeadGenerationDigitalMarketing /> */}
    </>

  )
}
