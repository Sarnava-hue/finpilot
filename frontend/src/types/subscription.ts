export interface Subscription {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  frequency: "monthly" | "yearly" | "weekly";
  nextPayment: string;
  status: "active" | "upcoming";
}