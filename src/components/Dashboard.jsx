import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import MonthlyReport from './MonthlyReport';
import { format, parseISO } from 'date-fns';
import { Plus, PieChart, List, Archive, Trash2, Folder } from 'lucide-react';
import { getArchives, saveArchives, saveExpenses } from '../utils/storage';
import Modal from './Modal';
import ManageArchivesModal from './ManageArchivesModal';

const Dashboard = ({ budget, expenses, setExpenses }) => {
    const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'report'
    const [modalConfig, setModalConfig] = useState({ isOpen: false });
    const [isManageArchivesOpen, setIsManageArchivesOpen] = useState(false);

    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const remaining = budget.amount - totalSpent;
    const isOverBudget = remaining < 0;

    const closeConfig = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handleArchiveMonth = () => {
        if (expenses.length === 0) {
            setModalConfig({
                isOpen: true,
                type: 'alert',
                title: 'No Expenses',
                message: "No expenses to archive for the current month.",
                onConfirm: closeConfig
            });
            return;
        }

        setModalConfig({
            isOpen: true,
            type: 'prompt',
            title: 'Archive Month',
            message: "Enter a label for this month (e.g. 'Feb 2026'):",
            defaultValue: format(new Date(), 'MMM yyyy'),
            onConfirm: (monthLabel) => {
                if (!monthLabel) {
                    closeConfig();
                    return;
                }

                const archives = getArchives();
                archives.push({
                    id: Date.now().toString(),
                    label: monthLabel,
                    budget: budget,
                    expenses: [...expenses],
                    dateArchived: new Date().toISOString()
                });
                saveArchives(archives);

                // Clear current expenses
                setExpenses([]);
                saveExpenses([]);

                setModalConfig({
                    isOpen: true,
                    type: 'alert',
                    title: 'Success',
                    message: "Month archived successfully! You can view it in the Monthly Report tab.",
                    onConfirm: closeConfig
                });
            },
            onCancel: closeConfig
        });
    };

    const handleDeleteExpense = (id) => {
        setModalConfig({
            isOpen: true,
            type: 'confirm',
            title: 'Delete Expense',
            message: "Are you sure you want to delete this expense?",
            onConfirm: () => {
                const updatedExpenses = expenses.filter(exp => exp.id !== id);
                setExpenses(updatedExpenses);
                saveExpenses(updatedExpenses);
                closeConfig();
            },
            onCancel: closeConfig
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Modal {...modalConfig} />
            <ManageArchivesModal isOpen={isManageArchivesOpen} onClose={() => setIsManageArchivesOpen(false)} />
            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-card animate-scale-in delay-100 hover-scale">
                    <h3 className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Total Budget</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }}>₹{budget.amount.toFixed(2)}</div>
                </div>

                <div className="glass-card animate-scale-in delay-200 hover-scale">
                    <h3 className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Total Spent</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }} className="text-danger">
                        ₹{totalSpent.toFixed(2)}
                    </div>
                </div>

                <div className="glass-card animate-scale-in delay-300 hover-scale">
                    <h3 className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Remaining</h3>
                    <div style={{ fontSize: '2rem', fontWeight: '700' }} className={isOverBudget ? 'text-danger' : 'text-success'}>
                        ₹{remaining.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('expenses')}
                    >
                        <List size={18} /> Daily Expenses
                    </button>
                    <button
                        className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('report')}
                    >
                        <PieChart size={18} /> Monthly Report
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsManageArchivesOpen(true)}
                        title="Manage and delete past archives"
                        style={{ borderColor: 'var(--glass-border)', color: 'var(--text-secondary)', background: 'transparent' }}
                    >
                        <Folder size={18} /> Manage Archives
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleArchiveMonth}
                        title="Save current month's data and start fresh"
                        style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', background: 'transparent' }}
                    >
                        <Archive size={18} /> Archive Month
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {activeTab === 'expenses' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="animate-fade-in delay-400">
                        <ExpenseForm setExpenses={setExpenses} />
                    </div>
                    <div className="glass-card animate-fade-in delay-500">
                        <h3 style={{ marginBottom: '1.5rem' }}>Recent Expenses</h3>
                        {expenses.length === 0 ? (
                            <p className="text-muted text-center" style={{ padding: '2rem' }}>No expenses logged yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[...expenses].reverse().map(exp => (
                                    <div key={exp.id} className="animate-slide-right hover-scale" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{exp.description}</div>
                                            <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                {exp.category} • {format(parseISO(exp.date), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div className="text-danger font-bold">
                                                -₹{parseFloat(exp.amount).toFixed(2)}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteExpense(exp.id)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-muted)', background: 'transparent', border: 'none' }}
                                                title="Delete Expense"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <MonthlyReport budget={budget} expenses={expenses} />
            )}
        </div>
    );
};

export default Dashboard;
