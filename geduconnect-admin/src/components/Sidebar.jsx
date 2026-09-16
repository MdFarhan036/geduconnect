import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiBriefcase,
  FiMenu,
  FiLayout,
  FiEdit3,
  FiBookOpen
} from "react-icons/fi";
import {
  AiFillFileAdd,
  AiFillFileImage
} from "react-icons/ai";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState({
    general: true,
    home: true,
    services: true,
    content: true,
    career: true,
    settings: true,
  });

  const toggleSection = (key) =>
    setOpen({ ...open, [key]: !open[key] });

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <h3>G Educonnect</h3>}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiMenu />
        </button>
      </div>

      <nav>

        {/* ================= GENERAL ================= */}
        <Section
          title="General"
          isOpen={open.general}
          onClick={() => toggleSection("general")}
          collapsed={collapsed}
        >
          <NavItem to="/dashboard" icon={<FiHome />} label="Dashboard" collapsed={collapsed} />
          <NavItem to="/enquiries" icon={<FiUsers />} label="Enquiries" collapsed={collapsed} />
        </Section>

        {/* ================= HOME ================= */}
        <Section
          title="Home Page"
          isOpen={open.home}
          onClick={() => toggleSection("home")}
          collapsed={collapsed}
        >
          <NavItem to="/home/hero" icon={<FiLayout />} label="Hero Section" collapsed={collapsed} />
          <NavItem to="/home/about" icon={<FiFileText />} label="About Section" collapsed={collapsed} />
          <NavItem to="/home/highlights" icon={<FiBriefcase />} label="Highlights" collapsed={collapsed} />
        </Section>

        {/* ================= SERVICES ================= */}
        <Section
          title="Services"
          isOpen={open.services}
          onClick={() => toggleSection("services")}
          collapsed={collapsed}
        >
          <NavItem to="/services" icon={<FiBriefcase />} label="All Services" collapsed={collapsed} />
        </Section>

        {/* ================= CONTENT ================= */}
        <Section
          title="Content"
          isOpen={open.content}
          onClick={() => toggleSection("content")}
          collapsed={collapsed}
        >
          <NavItem to="/blogs" icon={<AiFillFileAdd />} label="Blogs" collapsed={collapsed} />
          <NavItem to="/consultant-network" icon={<AiFillFileAdd />} label="Consultant Network" collapsed={collapsed} />
          <NavItem to="/journey" icon={<AiFillFileAdd />} label="Journey" collapsed={collapsed} />
          <NavItem to="/gallery" icon={<AiFillFileImage />} label="Gallery" collapsed={collapsed} />
          <NavItem to="/testimonials" icon={<FiUsers />} label="Testimonials" collapsed={collapsed} />
          <NavItem to="/faqs" icon={<FiHelpCircle />} label="FAQs" collapsed={collapsed} />
          <NavItem to="/clients" icon={<FiUsers />} label="Clients & Partners" collapsed={collapsed} />
          <NavItem to="/universities" icon={<FiUsers />} label="Universities" collapsed={collapsed} />
          <NavItem to="/admin/programs" icon={<FiUsers />} label="Programs" collapsed={collapsed} />
          <NavItem to="/admin/approvals" icon={<FiUsers />} label="Approvals" collapsed={collapsed} />
          <NavItem to="/admin/affiliations" icon={<FiUsers />} label="Affiliations" collapsed={collapsed} />
          <NavItem to="/admin/rankings" icon={<FiUsers />} label="Ranking" collapsed={collapsed} />
          
          <NavItem to="/why-choose-us" icon={<FiUsers />} label="why choose us" collapsed={collapsed} />
        </Section>

        {/* ================= CAREER ================= */}
        <Section
          title="Career"
          isOpen={open.career}
          onClick={() => toggleSection("career")}
          collapsed={collapsed}
        >
          <NavItem to="/careers/page" icon={<FiFileText />} label="Career Page" collapsed={collapsed} />
          <NavItem to="/careers/jobs" icon={<FiBriefcase />} label="Job Listings" collapsed={collapsed} />
        </Section>

        {/* ================= SETTINGS ================= */}
        <Section
          title="Settings"
          isOpen={open.settings}
          onClick={() => toggleSection("settings")}
          collapsed={collapsed}
        >
          <NavItem to="/site-settings" icon={<FiSettings />} label="Site Settings" collapsed={collapsed} />
        </Section>

      </nav>
    </aside>
  );
}

/* ---------- Nav Item ---------- */

function NavItem({ to, icon, label, collapsed }) {
  return (
    <NavLink to={to} className="nav-item">
      <span className="nav-icon">{icon}</span>
      {!collapsed && <span className="nav-label">{label}</span>}
    </NavLink>
  );
}

/* ---------- Section Wrapper ---------- */

function Section({ title, isOpen, onClick, collapsed, children }) {
  return (
    <div className="sidebar-section">
      <div className="section-title" onClick={onClick}>
        {!collapsed && <span>{title}</span>}
        {!collapsed && <span>{isOpen ? "▾" : "▸"}</span>}
      </div>
      {isOpen && <div className="section-links">{children}</div>}
    </div>
  );
}
