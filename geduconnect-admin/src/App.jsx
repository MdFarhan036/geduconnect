import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Public */
import Login from "./pages/Login";

/* Core admin pages */
import Dashboard from "./pages/Dashboard";
import Enquiries from "./pages/Enquiries";

/* Home CMS */
import HeroAdmin from "./pages/HeroAdmin";
import AboutAdmin from "./pages/AboutAdmin";
import HighlightsAdmin from "./pages/HighlightsAdmin";

/* Services */
import ServicesAdmin from "./pages/ServicesAdmin";
import ServiceDetails from "./pages/ServiceDetails";
import ServiceForm from "./pages/ServiceForm";
import ServiceBannersAdmin from "./pages/ServiceBannersAdmin";

/* Clients & Testimonials */
import TestimonialsAdmin from "./pages/TestimonialsAdmin";
import ClientsAdmin from "./pages/ClientsAdmin";
import ClientForm from "./pages/ClientForm";
/* Content */
import BlogAdmin from "./pages/BlogAdmin";
import BlogDetails from "./pages/BlogDetails";
import GalleryAdmin from "./pages/GalleryAdmin";
import FaqsAdmin from "./pages/FaqsAdmin";
import WhyChooseUsAdmin from "./pages/WhyChooseUsAdmin";

/* Career */
import CareerPageAdmin from "./pages/CareerPageAdmin";
import CareerJobsAdmin from "./pages/CareerJobsAdmin";
import JobApplicationsAdmin from "./pages/JobApplicationsAdmin";

/* Settings */
import SiteSettings from "./pages/SiteSettings";

/* Layout & Auth */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import UniversitiesAdmin from "./pages/UniversitiesAdmin";
import UniversityForm from "./pages/UniversityForm";
import "./App.css";
import ApprovalsMasterAdmin from "./pages/ApprovalsMasterAdmin";
import AffiliationsMasterAdmin from "./pages/AffiliationsMaterAdmin";
import RankingsMasterAdmin from "./pages/RankingsMasterAdmin";
import AddProgram from "./pages/AddProgram";
import AdminPrograms from "./pages/AdminPrograms";
import AdminJourneyPage from "./pages/AdminJourneyPage";
import AdminConsultantNetwork from "./pages/AdminConsultantNetwork";
import AdminProgramEdit from "./pages/AdminProgramEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* Default route */}
          <Route index element={<Navigate to="dashboard" />} />

          {/* ===== DASHBOARD ===== */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* ===== LEADS ===== */}
          <Route path="enquiries" element={<Enquiries />} />

          {/* ================= HOME CMS ================= */}
          <Route path="home/hero" element={<HeroAdmin />} />
          <Route path="home/about" element={<AboutAdmin />} />
          <Route path="home/highlights" element={<HighlightsAdmin />} />

          {/* ================= SERVICES ================= */}
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/edit/:id" element={<ServiceForm />} />
          <Route path="services/:slug" element={<ServiceDetails />} />
          <Route path="services/:id/banners" element={<ServiceBannersAdmin />} />

          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="clients" element={<ClientsAdmin />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/edit/:id" element={<ClientForm />} />
          <Route path="universities" element={<UniversitiesAdmin />} />
          <Route path="universities/new" element={<UniversityForm />} />
          <Route path="universities/edit/:id" element={<UniversityForm />} />
          <Route path="/admin/approvals" element={<ApprovalsMasterAdmin />} />
          <Route path="/admin/affiliations" element={<AffiliationsMasterAdmin />} />
          <Route path="/admin/rankings" element={<RankingsMasterAdmin />} />
          <Route path="/admin/programs/add" element={<AddProgram />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/programs/edit/:id" element={<AdminProgramEdit />} />
          {/* University-specific management */}
          {/* <Route
            path="/admin/university/:id/approvals"
            element={<UniversityApprovals />}
          />

          <Route
            path="/admin/university/:id/affiliations"
            element={<UniversityAffiliations />}
          />

          <Route
            path="/admin/university/:id/rankings"
            element={<UniversityRankings />}
          /> */}
          {/* ================= CONTENT ================= */}
          <Route path="journey" element={<AdminJourneyPage />} />
          <Route path="consultant-network" element={<AdminConsultantNetwork />} />
          <Route path="blogs" element={<BlogAdmin />} />
          <Route path="blogs/:slug" element={<BlogDetails />} />
          <Route path="why-choose-us" element={<WhyChooseUsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="faqs" element={<FaqsAdmin />} />

          {/* ================= CAREER ================= */}
          <Route path="careers/page" element={<CareerPageAdmin />} />
          <Route path="careers/jobs" element={<CareerJobsAdmin />} />
          <Route path="careers/applications" element={<JobApplicationsAdmin />} />

          {/* ================= SETTINGS ================= */}
          <Route path="site-settings" element={<SiteSettings />} />

        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}