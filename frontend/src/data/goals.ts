import { FinancialGoal } from "@/types/goal";

export const goals: FinancialGoal[] = [
  {
    id: "GOAL001",
    name: "New Laptop",
    targetAmount: 60000,
    currentAmount: 22000,
    deadline: "2027-03-31",
    category: "Purchase",
  },
  {
    id: "GOAL002",
    name: "Emergency Fund",
    targetAmount: 100000,
    currentAmount: 45000,
    deadline: "2027-06-30",
    category: "Savings",
  },
];