import { Category, Row } from "./types";

const calculateOpeningBalance = (data: Row[]) => {
  if (data.length === 0) return 0;

  // If "Opening Balance" is in one of the row's description, return that row's amount
  const openingBalanceRow = data.find(
    (row) =>
      row.description.toLowerCase().includes("opening balance") && row.show
  );
  if (openingBalanceRow) return openingBalanceRow.amount;

  // Get month and year from earliest date of data that is shown
  const earliestDate = data
    .filter((row) => row.show)
    .reduce((earliestDate, row) => {
      const date = new Date(row.date);
      if (date < earliestDate) {
        return date;
      }
      return earliestDate;
    }, new Date(data[0].date));
  const month = earliestDate.getMonth() + 1;
  const year = earliestDate.getFullYear();

  const openingBalance = data
    .filter((row) => {
      const date = new Date(row.date);
      return date.getMonth() + 1 < month && date.getFullYear() <= year;
    })
    .reduce((total, row) => {
      return total + row.amount;
    }, 0);

  // Round to 2dp
  return Math.round(openingBalance * 100) / 100;
};

const calculateExpenses = (data: Row[], categories: Category[]) => {
  if (data.length === 0) return 0;

  const expenses = categories.reduce((total, category) => {
    const categoryTotal = calculateTotal(
      category.rows.filter((row) => row.show),
      category.isInverted
    );
    return total + (categoryTotal < 0 ? Math.abs(categoryTotal) : 0);
  }, 0);

  return expenses;
};

const calculateIncome = (data: Row[], categories: Category[]) => {
  if (data.length === 0) return 0;

  const income = categories.reduce((total, category) => {
    const categoryTotal = calculateTotal(
      category.rows.filter((row) => row.show),
      category.isInverted
    );
    return total + (categoryTotal > 0 ? categoryTotal : 0);
  }, 0);
  return income;
};

const calculateNet = (data: Row[], categories: Category[]) => {
  if (data.length === 0) return 0;

  const net = calculateIncome(data, categories) - calculateExpenses(data, categories);
  return Math.round(net * 100) / 100;
};

const calculateTotal = (rows: Row[], isInverted?: boolean) => {
  let total = 0;
  rows.forEach((row) => {
    total += row.amount;
  });
  // Round total to 2dp
  total = Math.round(total * 100) / 100;
  if (isInverted) total *= -1;
  return total;
};

export {
  calculateOpeningBalance,
  calculateExpenses,
  calculateIncome,
  calculateNet,
  calculateTotal,
}