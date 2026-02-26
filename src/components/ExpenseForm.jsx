import { useState } from 'react';
import { addExpense } from '../utils/storage';
import { Plus } from 'lucide-react';

const CATEGORIES = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Health & Fitness',
    'Other'
];

const ExpenseForm = ({ setExpenses }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || amount <= 0 || !description || !date) {
            setError('Please fill in all fields correctly.');
            return;
        }

        const newExpense = {
            amount: parseFloat(amount),
            category,
            date: new Date(date).toISOString(),
            description,
            createdAt: new Date().toISOString()
        };

        const updatedExpenses = addExpense(newExpense);
        setExpenses(updatedExpenses);

        // Reset form
        setAmount('');
        setDescription('');
        setError('');
    };

    return (
        <div className="glass-card animate-fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Expense</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="amount">Amount (₹)</label>
                    <input
                        type="number"
                        id="amount"
                        className="form-input"
                        placeholder="0.00"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        className="form-input"
                        placeholder="What did you buy?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="category">Category</label>
                    <select
                        id="category"
                        className="form-input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ appearance: 'none' }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} style={{ color: '#000' }}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        className="form-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                {error && <p className="text-danger" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>}

                <button type="submit" className="btn btn-primary hover-scale" style={{ width: '100%', marginTop: '0.5rem' }}>
                    <Plus size={18} /> Add Expense
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
