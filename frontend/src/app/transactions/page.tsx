"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Upload,
} from "lucide-react";

import { transactions } from "@/data/transactions";
import { TransactionType } from "@/types/transaction";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState<"all" | TransactionType>("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.merchant
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || transaction.category === category;

      const matchesType =
        type === "all" || transaction.type === type;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [search, category, type]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Financial activity
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and explore all your financial transactions.
          </p>
        </div>

        <a
          href="/upload"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Upload size={17} />
          Upload Statement
        </a>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Transactions"
          value={transactions.length.toString()}
        />

        <SummaryCard
          label="Income"
          value={`₹${transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0)
            .toLocaleString()}`}
        />

        <SummaryCard
          label="Expenses"
          value={`₹${transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0)
            .toLocaleString()}`}
        />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={17} className="text-slate-400" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            >
              <option>All</option>
              <option>Food</option>
              <option>Shopping</option>
              <option>Transport</option>
              <option>Housing</option>
              <option>Entertainment</option>
              <option>Utilities</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Income</option>
              <option>Other</option>
            </select>
          </div>

          {/* Type */}
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "all" | TransactionType)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          >
            <option value="all">All transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Transaction
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-xl p-2 ${
                          transaction.type === "income"
                            ? "bg-emerald-50"
                            : "bg-slate-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDownLeft
                            size={17}
                            className="text-emerald-600"
                          />
                        ) : (
                          <ArrowUpRight
                            size={17}
                            className="text-slate-600"
                          />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {transaction.merchant}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {transaction.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatDate(transaction.date)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {transaction.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-slate-900"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-slate-700">
              No transactions found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}