import { useEffect, useRef, useState } from 'react';

export default function AnimatedSection({ id, children, style = {} }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      style={{
        background: '#141414',
        borderRadius: 18,
        padding: 30,
        marginBottom: 30,
        borderLeft: '5px solid #e50914',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: '.8s',
        ...style,
      }}
    >
      {children}
    </section>
  );
}
