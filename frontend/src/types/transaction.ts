export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Food"
  | "Shopping"
  | "Transport"
  | "Housing"
  | "Entertainment"
  | "Utilities"
  | "Healthcare"
  | "Education"
  | "Income"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}