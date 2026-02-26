import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { getArchives, deleteArchive } from '../utils/storage';

const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#64748b'];

const MonthlyReport = ({ budget, expenses }) => {
    const [archives, setArchives] = useState(getArchives());
    const [selectedMonthId, setSelectedMonthId] = useState('current');

    let currentBudget = budget;
    let currentExpenses = expenses;
    let currentLabel = 'Current Month';

    if (selectedMonthId !== 'current') {
        const selectedArchive = archives.find(a => a.id === selectedMonthId);
        if (selectedArchive) {
            currentBudget = selectedArchive.budget;
            currentExpenses = selectedArchive.expenses;
            currentLabel = selectedArchive.label;
        }
    }

    // Aggregate expenses by category
    const categoryData = currentExpenses.reduce((acc, exp) => {
        const existing = acc.find(item => item.name === exp.category);
        if (existing) {
            existing.value += parseFloat(exp.amount);
        } else {
            acc.push({ name: exp.category, value: parseFloat(exp.amount) });
        }
        return acc;
    }, []).sort((a, b) => b.value - a.value);

    // Aggregate expenses by day
    const dailyDataMap = currentExpenses.reduce((acc, exp) => {
        const day = format(parseISO(exp.date), 'MMM dd');
        if (acc[day]) {
            acc[day].amount += parseFloat(exp.amount);
        } else {
            acc[day] = { day, amount: parseFloat(exp.amount) };
        }
        return acc;
    }, {});

    const dailyData = Object.values(dailyDataMap).sort((a, b) => new Date(a.day) - new Date(b.day));

    // Prepare Month-Over-Month Comparison Data
    const comparisonData = archives.map(a => {
        const spent = a.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        return {
            name: a.label,
            Budget: parseFloat(a.budget.amount),
            Spent: spent
        };
    });

    const currentSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    comparisonData.push({
        name: 'Current',
        Budget: budget ? parseFloat(budget.amount) : 0,
        Spent: currentSpent
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--bg-secondary)', padding: '10px', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label || payload[0].name}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ margin: 0, color: entry.fill || entry.color || 'var(--accent-primary)' }}>
                            {entry.name}: ₹{entry.value.toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const handleDeleteArchive = () => {
        if (selectedMonthId !== 'current') {
            if (window.confirm('Are you sure you want to delete this monthly archive?')) {
                const updatedArchives = deleteArchive(selectedMonthId);
                setArchives(updatedArchives);
                setSelectedMonthId('current');
            }
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Month Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Reports</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {archives.length > 0 && (
                        <select
                            value={selectedMonthId}
                            onChange={(e) => setSelectedMonthId(e.target.value)}
                            className="custom-select"
                            style={{ width: 'auto', minWidth: '200px', cursor: 'pointer' }}
                        >
                            <option value="current">Current Month</option>
                            {[...archives].reverse().map(archive => (
                                <option key={archive.id} value={archive.id}>
                                    {archive.label}
                                </option>
                            ))}
                        </select>
                    )}
                    {selectedMonthId !== 'current' && (
                        <button
                            className="btn btn-danger"
                            style={{ padding: '0.5rem 1rem' }}
                            onClick={handleDeleteArchive}
                        >
                            Delete Report
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                {/* Expenses by Category Pie Chart */}
                <div className="glass-card animate-scale-in delay-100 hover-scale" style={{ height: '400px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Spending by Category ({currentLabel})</h3>
                    {currentExpenses.length === 0 ? (
                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }} className="text-muted">
                            No data available.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Daily Spending Bar Chart */}
                <div className="glass-card animate-scale-in delay-200 hover-scale" style={{ height: '400px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Daily Spending ({currentLabel})</h3>
                    {currentExpenses.length === 0 ? (
                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }} className="text-muted">
                            No data available.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="amount" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} name="Spent" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

            </div>

            {/* Month over Month Comparison */}
            {archives.length > 0 && (
                <div className="glass-card animate-scale-in delay-300 hover-scale" style={{ height: '400px' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Month-over-Month Comparison</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="Budget" fill="rgba(255, 255, 255, 0.3)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Spent" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default MonthlyReport;
