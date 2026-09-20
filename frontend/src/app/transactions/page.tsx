"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Upload,
} from "lucide-react";

import {
  getTransactions,
  Transaction as ApiTransaction,
} from "@/lib/api";

import { transactions as mockTransactions } from "@/data/transactions";
import { TransactionType } from "@/types/transaction";

interface DisplayTransaction {
  id: string;
  date: string;
  merchant: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<
    DisplayTransaction[]
  >([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState<
    "all" | TransactionType
  >("all");

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      try {
        setLoading(true);
        setApiError("");

        const data = await getTransactions();

        if (cancelled) return;

        const mapped: DisplayTransaction[] = data.map(
          (transaction: ApiTransaction) => ({
            id: String(transaction.id),
            date: transaction.date,
            merchant:
              transaction.merchant ||
              transaction.description ||
              "Unknown",
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.transaction_type,
            category: transaction.category || "Other",
          })
        );

        setTransactions(mapped);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Failed to load transactions:",
          error
        );

        setApiError(
          "Unable to load transactions from the backend."
        );

        // Keep the UI usable during development/demo.
        setTransactions(
          mockTransactions.map((transaction) => ({
            id: String(transaction.id),
            date: transaction.date,
            merchant: transaction.merchant,
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
          }))
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        transactions
          .map((transaction) => transaction.category)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !normalizedSearch ||
        transaction.merchant
          .toLowerCase()
          .includes(normalizedSearch) ||
        transaction.description
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesCategory =
        category === "All" ||
        transaction.category === category;

      const matchesType =
        type === "all" ||
        transaction.type === type;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });
  }, [transactions, search, category, type]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.type === "income"
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        ),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.type === "expense"
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        ),
    [transactions]
  );

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

      {/* Backend status */}
      {apiError && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            {apiError} Showing available demo data instead.
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-5 rounded-xl bg-slate-100 px-4 py-3">
          <p className="text-sm text-slate-500">
            Loading transactions...
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Transactions"
          value={transactions.length.toString()}
        />

        <SummaryCard
          label="Income"
          value={`₹${formatNumber(totalIncome)}`}
        />

        <SummaryCard
          label="Expenses"
          value={`₹${formatNumber(totalExpenses)}`}
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={17}
              className="text-slate-400"
            />

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as
                  | "all"
                  | TransactionType
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          >
            <option value="all">
              All transactions
            </option>

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expenses
            </option>
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
              {filteredTransactions.map(
                (transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-xl p-2 ${
                            transaction.type ===
                            "income"
                              ? "bg-emerald-50"
                              : "bg-slate-100"
                          }`}
                        >
                          {transaction.type ===
                          "income" ? (
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
                          transaction.type ===
                          "income"
                            ? "text-emerald-600"
                            : "text-slate-900"
                        }`}
                      >
                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}
                        ₹{formatNumber(transaction.amount)}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {!loading &&
          filteredTransactions.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-medium text-slate-700">
                No transactions found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Upload a financial statement or
                change your search and filters.
              </p>

              <a
                href="/upload"
                className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Upload Statement
              </a>
            </div>
          )}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Showing {filteredTransactions.length} of{" "}
        {transactions.length} transactions
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
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  const [year, month, day] = date
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(
    new Date(year, month - 1, day)
  );
}