"use client";

import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

import { obligations } from "@/data/obligations";

export default function UpcomingPage() {
  const totalCommitted = obligations.reduce(
    (sum, obligation) => sum + obligation.amount,
    0
  );

  const dueSoon = obligations.filter(
    (obligation) => obligation.status === "due-soon"
  ).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          Cash-flow planning
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Upcoming Obligations
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          See upcoming recurring payments and bills so you know how much
          of your money is already committed.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <SummaryCard
          title="Committed amount"
          value={`₹${totalCommitted.toLocaleString()}`}
          subtitle="Upcoming obligations"
          icon={<IndianRupee size={20} />}
        />

        <SummaryCard
          title="Upcoming payments"
          value={obligations.length.toString()}
          subtitle="Detected obligations"
          icon={<CalendarClock size={20} />}
        />

        <SummaryCard
          title="Due soon"
          value={dueSoon.toString()}
          subtitle="Requires attention"
          icon={<AlertCircle size={20} />}
        />
      </div>

      {/* Main list */}
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Payment timeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your expected upcoming financial commitments.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {obligations.map((obligation) => (
              <ObligationRow
                key={obligation.id}
                obligation={obligation}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cash flow warning */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <Clock3 size={20} className="text-slate-700" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Committed cash-flow
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You currently have ₹
              {totalCommitted.toLocaleString()} in upcoming financial
              obligations. FinPilot can compare this amount with your
              expected income and available budget to highlight potential
              cash-flow pressure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
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

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

function ObligationRow({
  obligation,
}: {
  obligation: {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    type:
      | "subscription"
      | "bill"
      | "rent"
      | "insurance"
      | "loan"
      | "other";
    recurring: boolean;
    status: "upcoming" | "due-soon";
  };
}) {
  const isDueSoon = obligation.status === "due-soon";

  return (
    <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            isDueSoon ? "bg-amber-50" : "bg-slate-100"
          }`}
        >
          {isDueSoon ? (
            <AlertCircle
              size={19}
              className="text-amber-600"
            />
          ) : (
            <CalendarClock
              size={19}
              className="text-slate-700"
            />
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {obligation.name}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs capitalize text-slate-500">
              {obligation.type}
            </span>

            {obligation.recurring && (
              <>
                <span className="text-slate-300">•</span>

                <span className="text-xs text-slate-500">
                  Recurring
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div>
          <p className="text-xs text-slate-400">
            Due date
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatDate(obligation.dueDate)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            ₹{obligation.amount.toLocaleString()}
          </p>

          <div className="mt-1 flex items-center justify-end gap-1">
            {isDueSoon ? (
              <AlertCircle
                size={12}
                className="text-amber-600"
              />
            ) : (
              <CheckCircle2
                size={12}
                className="text-slate-400"
              />
            )}

            <span className="text-xs text-slate-400">
              {isDueSoon ? "Due soon" : "Upcoming"}
            </span>
          </div>
        </div>
      </div>
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