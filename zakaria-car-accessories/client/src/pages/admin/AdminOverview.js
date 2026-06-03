import { useEffect, useState } from 'react';
import API from '../../utils/api';

export default function AdminOverview() {
  const [mediaCount, setMediaCount] = useState({ images: 0, videos: 0 });

  useEffect(() => {
    API.get('/media').then((r) => {
      const images = r.data.filter((m) => m.type === 'image').length;
      const videos = r.data.filter((m) => m.type === 'video').length;
      setMediaCount({ images, videos });
    });
  }, []);

  const cards = [
    { label: 'Total Images', value: mediaCount.images, icon: 'fa-solid fa-image', color: '#3b82f6' },
    { label: 'Total Videos', value: mediaCount.videos, icon: 'fa-solid fa-video', color: '#10b981' },
    { label: 'Site Status', value: 'Live', icon: 'fa-solid fa-circle-check', color: '#e50914' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Welcome to Zakaria Car Accessories admin panel.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 20 }}>
        {cards.map((c) => (
          <div
            key={c.label}
            style={{ background: '#141414', borderRadius: 16, padding: '24px 20px', borderTop: `3px solid ${c.color}` }}
          >
            <i className={c.icon} style={{ fontSize: '1.6rem', color: c.color }} />
            <div style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0 4px' }}>{c.value}</div>
            <div style={{ color: '#777', fontSize: '0.85rem' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, background: '#141414', borderRadius: 16, padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Quick Links</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '✏️ Edit Site Content', path: '/admin/content' },
            { label: '🖼️ Manage Media', path: '/admin/media' },
            { label: '🌐 View Live Site', path: '/', target: '_blank' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.path}
              target={item.target}
              style={{
                padding: '10px 18px',
                background: '#1b1b1b',
                borderRadius: 10,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
