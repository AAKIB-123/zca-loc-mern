import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const BASE = process.env.REACT_APP_API_URL || '';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [tab, setTab] = useState('image');
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [featured, setFeatured] = useState(false);
  const fileRef = useRef();

  const load = () => API.get('/media').then((r) => setMedia(r.data));

  useEffect(() => { load(); }, []);

  const filtered = media.filter((m) => m.type === tab);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error('Please select a file');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title || file.name);
    fd.append('category', category);
    fd.append('featured', featured);

    setUploading(true);
    try {
      await API.post('/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Uploaded!');
      setTitle('');
      fileRef.current.value = '';
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      await API.delete(`/media/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggleFeatured = async (item) => {
    await API.patch(`/media/${item._id}`, { featured: !item.featured });
    load();
  };

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Photos & Videos</h1>
      <p style={{ color: '#666', marginBottom: 28 }}>Upload and manage your media gallery.</p>

      {/* Upload card */}
      <div style={{ background: '#141414', borderRadius: 16, padding: 24, marginBottom: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Upload New File</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={lbl}>Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={inp} placeholder="e.g. New car wrap" />
          </div>
          <div>
            <label style={lbl}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inp}>
              {['general', 'gallery', 'banner', 'product'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>File (image or video)</label>
          <input ref={fileRef} type="file" accept="image/*,video/*" style={{ ...inp, padding: '8px' }} />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer' }}>
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Mark as Featured</span>
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            padding: '10px 28px',
            background: '#e50914',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontWeight: 700,
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? 'Uploading…' : '⬆ Upload'}
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['image', 'video'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 20px',
              borderRadius: 20,
              border: 'none',
              background: tab === t ? '#e50914' : '#1b1b1b',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {t === 'image' ? '🖼️ Images' : '🎬 Videos'} ({media.filter((m) => m.type === t).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 && (
        <p style={{ color: '#555', fontStyle: 'italic' }}>No {tab}s uploaded yet.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {filtered.map((item) => (
          <div key={item._id} style={{ background: '#141414', borderRadius: 14, overflow: 'hidden', border: item.featured ? '2px solid #e50914' : '2px solid transparent' }}>
            {item.type === 'image' ? (
              <img src={`${BASE}${item.url}`} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            ) : (
              <video src={`${BASE}${item.url}`} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            )}

            <div style={{ padding: '10px 12px' }}>
              <p style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title || 'Untitled'}
              </p>
              <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#666' }}>
                {item.category} · {(item.size / 1024).toFixed(0)} KB
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => toggleFeatured(item)}
                  title={item.featured ? 'Unfeature' : 'Feature'}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: 8,
                    border: 'none',
                    background: item.featured ? '#e50914' : '#2a2a2a',
                    color: '#fff',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  ⭐ {item.featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#2a2a2a',
                    color: '#e50914',
                    cursor: 'pointer',
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const lbl = { display: 'block', marginBottom: 6, color: '#aaa', fontSize: '0.82rem', fontWeight: 600 };
const inp = {
  width: '100%',
  padding: '10px 12px',
  background: '#0b0b0b',
  border: '1px solid #333',
  borderRadius: 8,
  color: '#fff',
  fontSize: '0.9rem',
  fontFamily: 'Poppins, sans-serif',
  boxSizing: 'border-box',
};
