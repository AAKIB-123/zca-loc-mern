import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminContent from './admin/AdminContent';
import AdminMedia from './admin/AdminMedia';
import AdminOverview from './admin/AdminOverview';

const navItems = [
  { to: '/admin', label: 'Overview', icon: 'fa-solid fa-gauge', end: true },
  { to: '/admin/content', label: 'Site Content', icon: 'fa-solid fa-pen-to-square' },
  { to: '/admin/media', label: 'Photos & Videos', icon: 'fa-solid fa-photo-film' },
];

export default function AdminDashboard() {
  const { adminEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0b0b' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 230,
          background: '#000',
          borderRight: '2px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ color: '#e50914', fontWeight: 700, fontSize: '1.1rem' }}>ZCA Admin</div>
          <div style={{ color: '#555', fontSize: '0.75rem', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {adminEmail}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                marginBottom: 4,
                color: isActive ? '#fff' : '#777',
                background: isActive ? '#e50914' : 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              })}
            >
              <i className={icon} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '0 12px' }}>
          <NavLink
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#777', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', marginBottom: 4 }}
          >
            <i className="fa-solid fa-eye" /> View Site
          </NavLink>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', width: '100%',
              background: 'none', border: 'none',
              color: '#777', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-right-from-bracket" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="media" element={<AdminMedia />} />
        </Routes>
      </main>
    </div>
  );
}
