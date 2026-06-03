import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.token, data.email);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0b',
        padding: 16,
      }}
    >
      <div
        style={{
          background: '#141414',
          borderRadius: 20,
          padding: '40px 32px',
          width: '100%',
          maxWidth: 400,
          borderTop: '4px solid #e50914',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ color: '#e50914' }}>Admin</span> Panel
        </h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 32, fontSize: '0.9rem' }}>
          Zakaria Car Accessories
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            placeholder="admin@zakaria.com"
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#e50914',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  fontSize: '0.85rem',
  color: '#aaa',
  fontWeight: 600,
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: '#1b1b1b',
  border: '1px solid #333',
  borderRadius: 10,
  color: '#fff',
  fontSize: '1rem',
  marginBottom: 18,
  outline: 'none',
  fontFamily: 'Poppins, sans-serif',
};
