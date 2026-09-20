"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  WalletCards,
} from "lucide-react";

import { budgets } from "@/data/budgets";

export default function BudgetsPage() {
  const [showForm, setShowForm] = useState(false);

  const totalBudget = useMemo(
    () => budgets.reduce((sum, budget) => sum + budget.limit, 0),
    []
  );

  const totalSpent = useMemo(
    () => budgets.reduce((sum, budget) => sum + budget.spent, 0),
    []
  );

  const totalRemaining = totalBudget - totalSpent;

  const overallPercentage = Math.round(
    (totalSpent / totalBudget) * 100
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            September 2026
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Budgets
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your spending against the limits you have set.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Add Budget
        </button>
      </div>

      {/* Overview cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <OverviewCard
          title="Total Budget"
          value={`₹${totalBudget.toLocaleString()}`}
          icon={<WalletCards size={20} />}
        />

        <OverviewCard
          title="Total Spent"
          value={`₹${totalSpent.toLocaleString()}`}
          icon={<ArrowUpRight size={20} />}
        />

        <OverviewCard
          title="Remaining"
          value={`₹${totalRemaining.toLocaleString()}`}
          icon={<ArrowDownRight size={20} />}
          warning={totalRemaining < 0}
        />
      </div>

      {/* Overall progress */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Overall Budget
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {overallPercentage}% of your monthly budget has been used.
            </p>
          </div>

          <span className="text-2xl font-bold text-slate-900">
            {overallPercentage}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              overallPercentage > 100
                ? "bg-amber-500"
                : "bg-slate-900"
            }`}
            style={{
              width: `${Math.min(overallPercentage, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Budget cards */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Category Budgets
        </h2>

        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <AddBudgetModal onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function OverviewCard({
  title,
  value,
  icon,
  warning = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          {icon}
        </div>
      </div>

      <p
        className={`mt-3 text-2xl font-bold ${
          warning ? "text-amber-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function BudgetCard({
  budget,
}: {
  budget: {
    id: string;
    category: string;
    limit: number;
    spent: number;
  };
}) {
  const percentage = Math.round(
    (budget.spent / budget.limit) * 100
  );

  const exceeded = budget.spent > budget.limit;

  const remaining = budget.limit - budget.spent;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-slate-900">
            {budget.category}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Monthly budget
          </p>
        </div>

        {exceeded && (
          <div className="rounded-lg bg-amber-50 p-2">
            <AlertTriangle
              size={17}
              className="text-amber-600"
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{budget.spent.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            of ₹{budget.limit.toLocaleString()}
          </p>
        </div>

        <p
          className={`text-sm font-semibold ${
            exceeded ? "text-amber-600" : "text-slate-600"
          }`}
        >
          {percentage}%
        </p>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            exceeded ? "bg-amber-500" : "bg-slate-900"
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <div className="mt-4 flex justify-between text-xs">
        <span className="text-slate-500">
          {exceeded ? "Over budget" : "Remaining"}
        </span>

        <span
          className={`font-medium ${
            exceeded ? "text-amber-600" : "text-slate-700"
          }`}
        >
          {exceeded
            ? `₹${Math.abs(remaining).toLocaleString()} over`
            : `₹${remaining.toLocaleString()}`}
        </span>
      </div>
    </div>
  );
}

function AddBudgetModal({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Budget
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set a monthly spending limit.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Category
            </label>

            <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none">
              <option>Food</option>
              <option>Shopping</option>
              <option>Transport</option>
              <option>Entertainment</option>
              <option>Utilities</option>
              <option>Healthcare</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Monthly limit
            </label>

            <input
              type="number"
              placeholder="5000"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Budget
          </button>
        </div>
      </div>
    </div>
  );
}