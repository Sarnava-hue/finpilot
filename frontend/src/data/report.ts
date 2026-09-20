export const monthlyReport = {
  month: "September 2026",

  income: 50000,
  expenses: 32400,
  savings: 17600,

  previousMonthExpenses: 28700,

  categories: [
    {
      name: "Housing",
      amount: 12000,
      percentage: 37,
      change: 0,
    },
    {
      name: "Food",
      amount: 5200,
      percentage: 16,
      change: 26,
    },
    {
      name: "Shopping",
      amount: 4300,
      percentage: 13,
      change: 18,
    },
    {
      name: "Transport",
      amount: 3100,
      percentage: 10,
      change: 11,
    },
    {
      name: "Utilities",
      amount: 2649,
      percentage: 8,
      change: 5,
    },
    {
      name: "Entertainment",
      amount: 1500,
      percentage: 5,
      change: -8,
    },
    {
      name: "Healthcare",
      amount: 780,
      percentage: 2,
      change: 4,
    },
  ],

  observations: [
    {
      title: "Food spending increased",
      description:
        "Food spending is approximately 26% higher than last month.",
      type: "attention",
    },
    {
      title: "Subscriptions detected",
      description:
        "You have recurring services costing approximately ₹1,866 per month.",
      type: "info",
    },
    {
      title: "Transport budget exceeded",
      description:
        "Transport spending is approximately ₹100 above the current budget.",
      type: "attention",
    },
    {
      title: "Savings remain positive",
      description:
        "You retained approximately 35.2% of your recorded income this month.",
      type: "positive",
    },
  ],
};