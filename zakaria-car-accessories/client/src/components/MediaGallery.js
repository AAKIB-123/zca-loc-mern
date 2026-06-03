import { useEffect, useState } from 'react';
import API from '../utils/api';

const BASE = process.env.REACT_APP_API_URL || '';

export default function MediaGallery() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tab, setTab] = useState('images');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    API.get('/media?type=image').then((r) => setImages(r.data));
    API.get('/media?type=video').then((r) => setVideos(r.data));
  }, []);

  const items = tab === 'images' ? images : videos;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {['images', 'videos'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 22px',
              borderRadius: 22,
              border: 'none',
              background: tab === t ? '#e50914' : '#2a2a2a',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No {tab} uploaded yet.</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {items.map((item) => (
          <div
            key={item._id}
            onClick={() => setLightbox(item)}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              background: '#1b1b1b',
              position: 'relative',
            }}
          >
            {item.type === 'image' ? (
              <img
                src={`${BASE}${item.url}`}
                alt={item.title}
                style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ position: 'relative' }}>
                <video
                  src={`${BASE}${item.url}`}
                  style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,.4)',
                  }}
                >
                  <i className="fa-solid fa-play" style={{ fontSize: '2rem', color: '#fff' }} />
                </div>
              </div>
            )}
            {item.title && (
              <p style={{ margin: '8px 10px', fontSize: '0.8rem', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          {lightbox.type === 'image' ? (
            <img src={`${BASE}${lightbox.url}`} alt={lightbox.title} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12 }} />
          ) : (
            <video src={`${BASE}${lightbox.url}`} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12 }} onClick={(e) => e.stopPropagation()} />
          )}
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      )}
    </div>
  );
}
