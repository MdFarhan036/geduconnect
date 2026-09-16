import api from "../api";

export default function Header() {
  const logout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <strong>Admin Panel</strong>

      <div className="header-actions">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}
