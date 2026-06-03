import { useEffect, useState } from 'react';
import Header from '../components/Header';
import AnimatedSection from '../components/AnimatedSection';
import MediaGallery from '../components/MediaGallery';
import API from '../utils/api';

const DEFAULT_CONTENT = {
  hero: { title: 'Zakaria Car Accessories', subtitle: 'Premium car accessories with expert fitting, honest pricing and trusted service.' },
  address: { text: 'Shop no-A5, ABC Complex, Opp. Over Bridge, Nandelav Chowkdi,\nBholav, Bharuch – 392001, Gujarat' },
  contacts: {
    phones: [
      { number: '+919714799474', display: '+91 97147 99474' },
      { number: '+919913982544', display: '+91 99139 82544' },
    ],
  },
  social: {
    facebook: 'https://www.facebook.com/zakaria.car.acc/',
    instagram: 'https://www.instagram.com/zakaria_car_accessories/',
    youtube: 'https://www.youtube.com/@ZAKARIA_CAR_ACCESSORIES',
  },
};

function useContent(key, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    API.get(`/content/${key}`)
      .then((r) => setData(r.data.data))
      .catch(() => {});
  }, [key]);
  return data;
}

export default function HomePage() {
  const hero = useContent('hero', DEFAULT_CONTENT.hero);
  const address = useContent('address', DEFAULT_CONTENT.address);
  const contacts = useContent('contacts', DEFAULT_CONTENT.contacts);
  const social = useContent('social', DEFAULT_CONTENT.social);

  return (
    <>
      <Header />

      <div style={{ maxWidth: 1000, margin: '36px auto', padding: '0 16px' }}>

        {/* Hero */}
        <AnimatedSection id="home">
          <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px' }}>
            <span style={{ color: '#e50914' }}>
              {hero.title?.split(' ')[0]}
            </span>{' '}
            {hero.title?.split(' ').slice(1).join(' ')}
          </h2>
          <p style={{ color: '#ddd', lineHeight: 1.7 }}>{hero.subtitle}</p>
        </AnimatedSection>

        {/* Address */}
        <AnimatedSection id="about">
          <h2>Address</h2>
          <p style={{ color: '#ddd', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{address.text}</p>
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection id="contact">
          <h2>Contact</h2>

          {contacts.phones?.map((p) => (
            <div
              key={p.number}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 18,
                borderRadius: 16,
                background: '#1b1b1b',
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
                <i className="fa-solid fa-phone" style={{ color: '#e50914' }} />
                <a href={`tel:${p.number}`} style={{ color: '#fff', textDecoration: 'none' }}>
                  {p.display}
                </a>
              </div>
              <a
                href={`https://wa.me/${p.number.replace('+', '')}`}
                style={{ background: '#25d366', color: '#fff', padding: '6px 14px', borderRadius: 22, fontSize: '0.9rem' }}
              >
                WhatsApp
              </a>
            </div>
          ))}

          <a
            href="/zakaria-car-accessories.vcf"
            download
            style={{
              display: 'block',
              marginTop: 24,
              padding: 18,
              textAlign: 'center',
              background: 'linear-gradient(135deg,#e50914,#ff2a2a)',
              borderRadius: 18,
              color: '#fff',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            💾 Save Contact
          </a>
        </AnimatedSection>

        {/* Social */}
        <AnimatedSection id="social">
          <h2>Social Media</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 }}>
            {[
              { key: 'facebook', icon: 'fa-brands fa-facebook', color: '#1877f2', label: 'Facebook' },
              { key: 'instagram', icon: 'fa-brands fa-instagram', color: '#e4405f', label: 'Instagram' },
              { key: 'youtube', icon: 'fa-brands fa-youtube', color: '#ff0000', label: 'YouTube' },
            ].map(({ key, icon, color, label }) =>
              social[key] ? (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    background: '#1b1b1b',
                    color: '#fff',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <i className={icon} style={{ fontSize: '1.2rem', color }} />
                  {label}
                </a>
              ) : null
            )}
          </div>
        </AnimatedSection>

        {/* Gallery */}
        <AnimatedSection id="gallery">
          <h2>Gallery</h2>
          <MediaGallery />
        </AnimatedSection>

        {/* Map */}
        <AnimatedSection>
          <h2>Find Us</h2>
          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => window.open('https://www.google.com/maps?q=Zakaria+Car+Accessories+Bharuch', '_blank')}
          >
            <iframe
              title="map"
              src="https://www.google.com/maps?q=Zakaria+Car+Accessories+Bharuch&output=embed"
              style={{ width: '100%', height: 300, border: 'none', borderRadius: 16, pointerEvents: 'none' }}
            />
            <div style={{ position: 'absolute', inset: 0 }} />
          </div>
        </AnimatedSection>

      </div>

      <footer style={{ textAlign: 'center', padding: 18, background: '#000', color: '#aaa' }}>
        © {new Date().getFullYear()} Zakaria Car Accessories. All rights reserved.
      </footer>
    </>
  );
}
