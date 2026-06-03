import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handler = () => {
      const cur = window.scrollY;
      setHidden(cur > lastScroll.current && cur > 80);
      lastScroll.current = cur <= 0 ? 0 : cur;
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`${styles.header} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.inner}>
        <div className={styles.logoBox}>
          <img src="/ZCA_NEW_LOGO2-removebg-preview.png" alt="Zakaria Car Accessories" />
        </div>

        <button className={styles.toggle} onClick={() => setMenuOpen((p) => !p)}>
          <i className={menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
          {['home', 'about', 'contact', 'social', 'gallery'].map((id) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
