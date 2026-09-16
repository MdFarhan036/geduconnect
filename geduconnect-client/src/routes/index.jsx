import {
    createBrowserRouter,
} from "react-router-dom";
import App from "../App";
import { Contact } from "../pages/Contact";
import CareerPage from "../pages/CareerPage";
import { EscalateAdmissions } from "../components/EscalateAdmissions";
import { OurPublications } from "../components/OurPublications";
import { ERPandCRM } from "../components/ERPandCRM";
import { LeadGenerationDigitalMarketing } from "../components/LeadGenerationDigitalMarketing";
import { EndtoEndunivManagement } from "../components/EndtoEndunivManagement";
import { AdmissionsBPOManagement } from "../components/AdmissionsBPOManagement";
import ScrollToTop from "../pages/ScrollToTop";
import { AdmissionFinancing } from "../components/AdmissionFinancing";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { TermsAndConditions } from "../pages/TermsAndConditions";
import { Home } from "../pages/Home";
import About from "../components/About";
import WhyChooseUs from "../pages/WhyChooseUs";
import BlogsCarousel from "../components/BlogsCarousel";
import SingleBlog from "../components/SingleBlog";
import Gallery from "../pages/Gallery";
import Clients from "../pages/Clients";
import Testimonials from "../components/Testimonials";
import ServiceDetails from "../pages/ServiceDetails";
import { Services } from "../components/Services";
import { ClientsPage } from "../pages/ClientsPage";
import TestimonialsPage from "../pages/TestimonialsPage";
import UniversityDetails from "../pages/UniversityDetails";
import CompareUniversities from "../pages/CompareUniversities";
import Programs from "../components/Programs";
import ConsultantNetwork from "../components/ConsultantNetwork";
import OurJourney from "../pages/OurJourney";



const router = createBrowserRouter([
    {
        path: "/",
        element: <><ScrollToTop /><App /></>,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/about",
                element: <About variant="page" />
            },
            {
                path: "/service",
                element: <Services />
            },
            {
                path: "/services/:slug",
                element: <ServiceDetails />
            },
            {
                path: "/university/:slug",
                element: <UniversityDetails />
            },
            {
                path: "/university/:slug/:tabSlug",
                element: <UniversityDetails />
            },
            {
                path: "/clients-partner",
                element: <Clients />
            },
            {
                path: "/clients",
                element: <ClientsPage />
            },
            {
                path: "/programs",
                element: <Programs />
            },
            {
                path: "/compare",
                element: <CompareUniversities />
            },
            {
                path: "/our-journey",
                element: <OurJourney />
            },
            {
                path: "/testimonial",
                element: <TestimonialsPage />
            },
            {
                path: "/whychooseus",
                element: <WhyChooseUs />
            },
            {
                path: "/privacypolicy",
                element: <PrivacyPolicy />
            },
            {
                path: "/termsandconditions",
                element: <TermsAndConditions />
            },
            {
                path: "/careerpage",
                element: <CareerPage />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/gallery",
                element: <Gallery />
            },
            {
                path: "/blog",
                element: <BlogsCarousel />
            },
            {
                path: "/blog/:slug",
                element: <SingleBlog />
            },
            { path: "/escalateAdmissions", element: <EscalateAdmissions /> },
            { path: "/ourPublications", element: <OurPublications /> },
            { path: "/erpandCRM", element: <ERPandCRM /> },
            { path: "/consultantNetwork", element: <ConsultantNetwork /> },
            { path: "/leadGenerationDigitalMarketing", element: <LeadGenerationDigitalMarketing /> },
            { path: "/endtoEndunivManagement", element: <EndtoEndunivManagement /> },
            { path: "/admissionsBPOManagement", element: <AdmissionsBPOManagement /> },
            { path: "/admissionfinancing", element: <AdmissionFinancing /> },
        ]
    },
]);

export default router;