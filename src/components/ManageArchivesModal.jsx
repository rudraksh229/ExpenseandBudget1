import { useState, useEffect } from 'react';
import { getArchives, deleteArchive } from '../utils/storage';
import { Trash2, X } from 'lucide-react';

const ManageArchivesModal = ({ isOpen, onClose }) => {
    const [archives, setArchives] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setArchives(getArchives());
        }
    }, [isOpen]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this archived month? All its data will be lost.')) {
            const updated = deleteArchive(id);
            setArchives(updated);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div className="glass-card animate-scale-in" style={{
                width: '90%',
                maxWidth: '500px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxHeight: '80vh',
                background: 'var(--bg-secondary)', // Less transparent for modals
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', width: 'fit-content' }}>Manage Archives</h3>
                    <button onClick={onClose} style={{ padding: '0.5rem', borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                    {archives.length === 0 ? (
                        <p className="text-muted text-center" style={{ padding: '2rem 0' }}>No archived months found.</p>
                    ) : (
                        [...archives].reverse().map(archive => (
                            <div key={archive.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{archive.label}</div>
                                    <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                        Archived on: {new Date(archive.dateArchived).toLocaleDateString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(archive.id)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                                    title="Delete Archive"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageArchivesModal;
