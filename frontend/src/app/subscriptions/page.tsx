"use client";

import {
  CalendarClock,
  CreditCard,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { subscriptions } from "@/data/subscriptions";

export default function SubscriptionsPage() {
  const monthlyCost = subscriptions
    .filter((subscription) => subscription.frequency === "monthly")
    .reduce((sum, subscription) => sum + subscription.amount, 0);

  const yearlyCost = monthlyCost * 12;

  return (
    <div className="p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          Recurring expenses
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Subscriptions
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          FinPilot identifies recurring payments and helps you understand
          how much of your money is committed to subscriptions and services.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <SummaryCard
          title="Monthly recurring"
          value={`₹${monthlyCost.toLocaleString()}`}
          subtitle="Expected every month"
          icon={<RefreshCw size={20} />}
        />

        <SummaryCard
          title="Estimated yearly"
          value={`₹${yearlyCost.toLocaleString()}`}
          subtitle="If subscriptions continue"
          icon={<TrendingUp size={20} />}
        />

        <SummaryCard
          title="Active subscriptions"
          value={subscriptions.length.toString()}
          subtitle="Detected recurring services"
          icon={<CreditCard size={20} />}
        />
      </div>

      {/* Subscription list */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Detected subscriptions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recurring payments identified from your financial activity.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            {subscriptions.map((subscription) => (
              <SubscriptionRow
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="rounded-xl bg-slate-100 p-3">
            <CalendarClock size={20} className="text-slate-700" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              FinPilot subscription insight
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You have approximately ₹
              {monthlyCost.toLocaleString()} in recurring monthly
              subscriptions. That represents ₹
              {yearlyCost.toLocaleString()} over a full year if the
              current subscriptions continue.
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

function SubscriptionRow({
  subscription,
}: {
  subscription: {
    id: string;
    merchant: string;
    category: string;
    amount: number;
    frequency: "monthly" | "yearly" | "weekly";
    nextPayment: string;
    status: "active" | "upcoming";
  };
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          <CreditCard size={19} className="text-slate-700" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {subscription.merchant}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {subscription.category}
            </span>

            <span className="text-slate-300">•</span>

            <span className="text-xs text-slate-500">
              {subscription.frequency}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div>
          <p className="text-xs text-slate-400">
            Next payment
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatDate(subscription.nextPayment)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            ₹{subscription.amount.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            / {subscription.frequency}
          </p>
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