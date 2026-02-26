import { AlertCircle, X } from 'lucide-react';

const NotificationBanner = ({ onDismiss }) => {
    return (
        <div className="notification-banner">
            <AlertCircle size={24} />
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>Missing Expense Data</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                    It looks like you haven't logged any expenses recently. Please update your data to keep your budget accurate!
                </p>
            </div>
            <button
                className="btn btn-secondary"
                onClick={onDismiss}
                style={{ padding: '0.5rem' }}
                aria-label="Dismiss notification"
            >
                <X size={20} />
            </button>
        </div>
    );
};

export default NotificationBanner;
