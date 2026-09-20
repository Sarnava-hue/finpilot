import { Subscription } from "@/types/subscription";

export const subscriptions: Subscription[] = [
  {
    id: "SUB001",
    merchant: "Netflix",
    category: "Entertainment",
    amount: 649,
    frequency: "monthly",
    nextPayment: "2026-09-28",
    status: "upcoming",
  },
  {
    id: "SUB002",
    merchant: "Spotify",
    category: "Entertainment",
    amount: 119,
    frequency: "monthly",
    nextPayment: "2026-10-03",
    status: "active",
  },
  {
    id: "SUB003",
    merchant: "Amazon Prime",
    category: "Shopping",
    amount: 299,
    frequency: "monthly",
    nextPayment: "2026-10-10",
    status: "active",
  },
  {
    id: "SUB004",
    merchant: "Jio",
    category: "Utilities",
    amount: 799,
    frequency: "monthly",
    nextPayment: "2026-10-13",
    status: "active",
  },
];