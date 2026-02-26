import { useState, useEffect } from 'react';
import { getBudget, getExpenses, saveLastLogin, getLastLogin } from './utils/storage';
import { format, isToday, parseISO } from 'date-fns';
import { Edit2 } from 'lucide-react';
import BudgetSetup from './components/BudgetSetup';
import Dashboard from './components/Dashboard';
import NotificationBanner from './components/NotificationBanner';
import './App.css';

function App() {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [missingDays, setMissingDays] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  useEffect(() => {
    // Load initial data
    const savedBudget = getBudget();
    const savedExpenses = getExpenses();
    if (savedBudget) setBudget(savedBudget);
    if (savedExpenses.length > 0) setExpenses(savedExpenses);

    // Check for missing days
    checkMissingDays(savedExpenses);

    // Update last login to today
    saveLastLogin(new Date().toISOString());
  }, []);

  const checkMissingDays = (currentExpenses) => {
    const lastLoginStr = getLastLogin();
    if (!lastLoginStr) return;

    const lastLoginDate = parseISO(lastLoginStr);
    const today = new Date();

    // A simple logic: if last login was yesterday or before, 
    // and no expense was added yesterday/today, we show a notification.
    if (!isToday(lastLoginDate)) {
      // Check if there's any expense exactly for the missing days (simplified check)
      const hasRecentExpense = currentExpenses.some(exp => {
        const expDate = parseISO(exp.date);
        return isToday(expDate) || expDate >= lastLoginDate;
      });
      if (!hasRecentExpense) setMissingDays(true);
    }
  };

  const handleBudgetSubmit = (newBudget) => {
    setBudget(newBudget);
    setIsEditingBudget(false);
  };

  const dismissNotification = () => {
    setMissingDays(false);
  };

  return (
    <div className="app-container">
      <header className="flex-between">
        <h1>Tracker</h1>
        {budget && !isEditingBudget && (
          <div className="text-muted flex-between" style={{ gap: '1rem' }}>
            <span><span className="text-success font-bold">₹{budget.amount}</span> / month</span>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.4rem', borderRadius: '50%' }}
              onClick={() => setIsEditingBudget(true)}
              title="Edit Budget"
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </header>

      {missingDays && <NotificationBanner onDismiss={dismissNotification} />}

      {!budget || isEditingBudget ? (
        <BudgetSetup
          onComplete={handleBudgetSubmit}
          initialAmount={budget ? budget.amount : ''}
          editMode={isEditingBudget}
          onCancel={isEditingBudget ? () => setIsEditingBudget(false) : undefined}
        />
      ) : (
        <Dashboard
          budget={budget}
          expenses={expenses}
          setExpenses={setExpenses}
        />
      )}
    </div>
  );
}

export default App;
