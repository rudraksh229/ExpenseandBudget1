import { useState, useEffect } from 'react';
import { saveBudget } from '../utils/storage';

const BudgetSetup = ({ onComplete, initialAmount = '', editMode = false, onCancel }) => {
    const [amount, setAmount] = useState(initialAmount);
    const [error, setError] = useState('');

    useEffect(() => {
        setAmount(initialAmount);
    }, [initialAmount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Please enter a valid positive amount.');
            return;
        }
        const newBudget = { amount: parseFloat(amount), setAt: new Date().toISOString() };
        saveBudget(newBudget);
        onComplete(newBudget);
    };

    return (
        <div className="glass-card animate-fade-in" style={{ maxWidth: '500px', margin: '4rem auto' }}>
            <h2>{editMode ? 'Update Budget' : 'Welcome!'}</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                {editMode ? 'Update your monthly budget below.' : "Let's start by setting up your monthly budget."}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="budget">Monthly Budget (₹)</label>
                    <input
                        type="number"
                        id="budget"
                        className="form-input"
                        placeholder="e.g. 2000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                {error && <p className="text-danger" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        {editMode ? 'Update Budget' : 'Set Budget'}
                    </button>
                    {editMode && onCancel && (
                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default BudgetSetup;
