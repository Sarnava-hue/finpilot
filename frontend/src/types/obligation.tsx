export type ObligationType =
  | "subscription"
  | "bill"
  | "rent"
  | "insurance"
  | "loan"
  | "other";

export interface Obligation {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  type: ObligationType;
  recurring: boolean;
  status: "upcoming" | "due-soon";
}