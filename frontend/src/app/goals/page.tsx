"use client";

import { useState } from "react";
import {
  CalendarDays,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";

import { goals } from "@/data/goals";

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false);

  const totalTarget = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Financial planning
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Financial Goals
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track what you are saving for and understand what it will take
            to reach your goals.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Add Goal
        </button>
      </div>

      {/* Overview */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <SummaryCard
          title="Active Goals"
          value={goals.length.toString()}
          icon={<Target size={20} />}
        />

        <SummaryCard
          title="Total Target"
          value={`₹${totalTarget.toLocaleString()}`}
          icon={<TrendingUp size={20} />}
        />

        <SummaryCard
          title="Total Saved"
          value={`₹${totalSaved.toLocaleString()}`}
          icon={<Target size={20} />}
        />
      </div>

      {/* Goals */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Your Goals
        </h2>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <TrendingUp size={20} className="text-slate-700" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              FinPilot Goal Insight
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Based on your current savings patterns, FinPilot can estimate
              how much you may need to save each month to reach your goals.
              Once connected to your financial data, these estimates will
              automatically adapt to your actual spending.
            </p>
          </div>
        </div>
      </div>

      {showForm && (
        <AddGoalModal onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function GoalCard({
  goal,
}: {
  goal: {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    category: string;
  };
}) {
  const remaining = goal.targetAmount - goal.currentAmount;

  const progress = Math.min(
    Math.round(
      (goal.currentAmount / goal.targetAmount) * 100
    ),
    100
  );

  const today = new Date();
  const deadline = new Date(goal.deadline);

  const monthsRemaining = Math.max(
    1,
    Math.ceil(
      (deadline.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24 * 30)
    )
  );

  const monthlyRequired = Math.ceil(
    remaining / monthsRemaining
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {goal.category}
          </span>

          <h3 className="mt-4 text-xl font-semibold text-slate-900">
            {goal.name}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-100 p-3">
          <Target size={21} className="text-slate-700" />
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{goal.currentAmount.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            of ₹{goal.targetAmount.toLocaleString()}
          </p>
        </div>

        <p className="text-lg font-semibold text-slate-700">
          {progress}%
        </p>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Remaining
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            ₹{remaining.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Monthly target
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            ₹{monthlyRequired.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
        <CalendarDays size={15} />

        Deadline:{" "}
        {new Date(goal.deadline).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>
    </div>
  );
}

function AddGoalModal({
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
              Create Financial Goal
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Define something you are saving towards.
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
              Goal name
            </label>

            <input
              placeholder="e.g. New Laptop"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Target amount
            </label>

            <input
              type="number"
              placeholder="60000"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Current savings
            </label>

            <input
              type="number"
              placeholder="10000"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Deadline
            </label>

            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
}