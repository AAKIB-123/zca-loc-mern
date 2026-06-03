import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const SECTIONS = ['hero', 'address', 'contacts', 'social'];

export default function AdminContent() {
  const [active, setActive] = useState('hero');
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get(`/content/${active}`)
      .then((r) => setData(r.data.data))
      .catch(() => setData(getDefault(active)));
  }, [active]);

  const save = async () => {
    setSaving(true);
    try {
      await API.put(`/content/${active}`, { data });
      toast.success('Saved successfully!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Site Content</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Edit what's shown on the public website.</p>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            style={{
              padding: '8px 18px',
              borderRadius: 22,
              border: 'none',
              background: active === s ? '#e50914' : '#1b1b1b',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ background: '#141414', borderRadius: 16, padding: 28 }}>
        {active === 'hero' && (
          <HeroEditor data={data} setData={setData} />
        )}
        {active === 'address' && (
          <AddressEditor data={data} setData={setData} />
        )}
        {active === 'contacts' && (
          <ContactsEditor data={data} setData={setData} />
        )}
        {active === 'social' && (
          <SocialEditor data={data} setData={setData} />
        )}

        <button
          onClick={save}
          disabled={saving}
          style={{
            marginTop: 24,
            padding: '12px 32px',
            background: '#e50914',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// Sub-editors

function HeroEditor({ data, setData }) {
  return (
    <>
      <Field label="Title" value={data.title || ''} onChange={(v) => setData({ ...data, title: v })} />
      <Field label="Subtitle" value={data.subtitle || ''} onChange={(v) => setData({ ...data, subtitle: v })} textarea />
    </>
  );
}

function AddressEditor({ data, setData }) {
  return (
    <Field label="Address" value={data.text || ''} onChange={(v) => setData({ ...data, text: v })} textarea />
  );
}

function ContactsEditor({ data, setData }) {
  const phones = data.phones || [{ number: '', display: '' }];
  const update = (i, key, val) => {
    const arr = phones.map((p, idx) => (idx === i ? { ...p, [key]: val } : p));
    setData({ ...data, phones: arr });
  };
  const add = () => setData({ ...data, phones: [...phones, { number: '', display: '' }] });
  const remove = (i) => setData({ ...data, phones: phones.filter((_, idx) => idx !== i) });

  return (
    <>
      {phones.map((p, i) => (
        <div key={i} style={{ background: '#1b1b1b', borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: '#aaa' }}>Phone {i + 1}</span>
            {phones.length > 1 && (
              <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', color: '#e50914', cursor: 'pointer' }}>
                Remove
              </button>
            )}
          </div>
          <Field label="Number (e.g. +919714799474)" value={p.number} onChange={(v) => update(i, 'number', v)} />
          <Field label="Display (e.g. +91 97147 99474)" value={p.display} onChange={(v) => update(i, 'display', v)} />
        </div>
      ))}
      <button onClick={add} style={{ padding: '8px 16px', background: '#1b1b1b', border: '1px dashed #444', borderRadius: 8, color: '#aaa', cursor: 'pointer' }}>
        + Add Phone
      </button>
    </>
  );
}

function SocialEditor({ data, setData }) {
  return (
    <>
      <Field label="Facebook URL" value={data.facebook || ''} onChange={(v) => setData({ ...data, facebook: v })} />
      <Field label="Instagram URL" value={data.instagram || ''} onChange={(v) => setData({ ...data, instagram: v })} />
      <Field label="YouTube URL" value={data.youtube || ''} onChange={(v) => setData({ ...data, youtube: v })} />
    </>
  );
}

function Field({ label, value, onChange, textarea }) {
  const common = {
    width: '100%',
    padding: '10px 12px',
    background: '#0b0b0b',
    border: '1px solid #333',
    borderRadius: 8,
    color: '#fff',
    fontSize: '0.95rem',
    marginBottom: 16,
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  };
  return (
    <>
      <label style={{ display: 'block', marginBottom: 6, color: '#aaa', fontSize: '0.85rem', fontWeight: 600 }}>{label}</label>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} style={common} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} style={common} />
      )}
    </>
  );
}

function getDefault(key) {
  const defaults = {
    hero: { title: 'Zakaria Car Accessories', subtitle: 'Premium car accessories with expert fitting.' },
    address: { text: 'Shop no-A5, ABC Complex, Bharuch – 392001' },
    contacts: { phones: [{ number: '+919714799474', display: '+91 97147 99474' }] },
    social: { facebook: '', instagram: '', youtube: '' },
  };
  return defaults[key] || {};
}
