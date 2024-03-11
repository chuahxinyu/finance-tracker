export const SAMPLE_DATA = [
  {
    date: new Date("2023-01-01"),
    description: "Opening Balance",
    amount: 1000,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-01-02"),
    description: "Salary",
    amount: 2000,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-01-03"),
    description: "Rent",
    amount: -500,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-02-03"),
    description: "Rent",
    amount: -500,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-03-03"),
    description: "Rent",
    amount: -500,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-01-04"),
    description: "Groceries 1",
    amount: -10,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-02-04"),
    description: "Groceries 2",
    amount: -50,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-03-04"),
    description: "Groceries 3",
    amount: -100,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-04-05"),
    description: "Movies",
    amount: -50,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-05-05"),
    description: "Doctor 1",
    amount: -50,
    category: "Uncategorised",
    show: true,
  },
  {
    date: new Date("2023-06-05"),
    description: "Hospital",
    amount: -100,
    category: "Uncategorised",
    show: true,
  },
];

export const MOCK_RULES = [
  {
    name: "Rent",
    searchFor: "rent",
    category: "Rent",
  },
  {
    name: "Groceries",
    searchFor: "groceries",
    category: "Groceries",
  },
  {
    name: "Movies",
    searchFor: "movies",
    category: "Entertainment",
  },
  {
    name: "Doctor",
    searchFor: "doctor",
    category: "Medical",
  },
  {
    name: "Hospital",
    searchFor: "hospital",
    category: "Medical",
  },
  {
    name: "Salary",
    searchFor: "salary",
    category: "Salary",
  },
];
