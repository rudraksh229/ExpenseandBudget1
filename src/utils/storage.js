const STORAGE_KEYS = {
  BUDGET: 'expense_tracker_budget',
  EXPENSES: 'expense_tracker_expenses',
  LAST_LOGIN: 'expense_tracker_last_login',
  ARCHIVES: 'expense_tracker_archives'
};

// Budget Storage
export const saveBudget = (budget) => {
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
};

export const getBudget = () => {
  const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
  return data ? JSON.parse(data) : null;
};

// Expense Storage
export const saveExpenses = (expenses) => {
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
};

export const getExpenses = () => {
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  expenses.push({ ...expense, id: Date.now().toString() });
  saveExpenses(expenses);
  return expenses;
};

// Date Tracking for Notifications
export const saveLastLogin = (dateStr) => {
  localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, dateStr);
};

export const getLastLogin = () => {
  return localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
};

// Archives Storage
export const saveArchives = (archives) => {
  localStorage.setItem(STORAGE_KEYS.ARCHIVES, JSON.stringify(archives));
};

export const getArchives = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ARCHIVES);
  return data ? JSON.parse(data) : [];
};

export const deleteArchive = (id) => {
  const archives = getArchives();
  const updatedArchives = archives.filter(archive => archive.id !== id);
  saveArchives(updatedArchives);
  return updatedArchives;
};
