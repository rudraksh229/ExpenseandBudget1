import React, { useState, useEffect } from 'react';

const Modal = ({
    isOpen,
    title,
    message,
    type = 'alert', // 'alert', 'confirm', 'prompt'
    defaultValue = '',
    onConfirm,
    onCancel,
    confirmText = 'OK',
    cancelText = 'Cancel'
}) => {
    const [inputValue, setInputValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) {
            setInputValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

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
                maxWidth: '400px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                background: 'var(--bg-secondary)', // Less transparent for modals
            }}>
                <div>
                    <h3 style={{ marginBottom: '0.5rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', width: 'fit-content' }}>{title}</h3>
                    <p className="text-muted">{message}</p>
                </div>

                {type === 'prompt' && (
                    <input
                        type="text"
                        className="form-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onConfirm(inputValue);
                            }
                        }}
                        autoFocus
                    />
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                    {(type === 'confirm' || type === 'prompt') && (
                        <button className="btn btn-secondary" onClick={onCancel}>
                            {cancelText}
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={() => onConfirm(type === 'prompt' ? inputValue : undefined)}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
