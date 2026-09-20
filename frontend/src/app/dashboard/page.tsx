"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  CreditCard,
  CalendarClock,
} from "lucide-react";

const stats = [
  {
    title: "Total Income",
    value: "₹50,000",
    change: "+8.4%",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Total Expenses",
    value: "₹32,400",
    change: "+4.2%",
    positive: false,
    icon: CreditCard,
  },
  {
    title: "Total Savings",
    value: "₹17,600",
    change: "+12.7%",
    positive: true,
    icon: Wallet,
  },
  {
    title: "Upcoming",
    value: "₹15,498",
    change: "5 payments",
    positive: false,
    icon: CalendarClock,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          September 2026
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Financial Overview
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Understand where your money is going and stay on top of your goals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {stat.value}
                  </h2>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <Icon size={20} className="text-slate-700" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs">
                {stat.positive ? (
                  <ArrowUpRight size={14} className="text-emerald-600" />
                ) : (
                  <ArrowDownRight size={14} className="text-amber-600" />
                )}

                <span
                  className={
                    stat.positive
                      ? "font-medium text-emerald-600"
                      : "font-medium text-amber-600"
                  }
                >
                  {stat.change}
                </span>

                <span className="text-slate-400">
                  vs last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Spending chart placeholder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Spending Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your expenses compared with the previous month
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
              <option>September 2026</option>
              <option>August 2026</option>
              <option>July 2026</option>
            </select>
          </div>

          <div className="mt-8 flex h-64 items-center justify-center rounded-xl bg-slate-50">
            <p className="text-sm text-slate-400">
              Spending chart coming next
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            FinPilot Insights
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Things worth knowing this month
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                Food spending increased
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your food expenses are 26% higher than last month.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                3 subscriptions detected
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your recurring subscriptions cost approximately ₹1,067/month.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                Upcoming obligations
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                ₹15,498 in recurring payments are expected soon.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Budget */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Budget Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                September spending
              </p>
            </div>

            <a
              href="/budgets"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              View all
            </a>
          </div>

          <div className="mt-6 space-y-5">
            <BudgetRow
              name="Food"
              spent={5200}
              budget={5000}
            />

            <BudgetRow
              name="Shopping"
              spent={3400}
              budget={4000}
            />

            <BudgetRow
              name="Transport"
              spent={3100}
              budget={3000}
            />
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Upcoming Payments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Detected recurring obligations
              </p>
            </div>

            <a
              href="/upcoming"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              View all
            </a>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            <PaymentRow
              name="Rent"
              date="Sep 25"
              amount="₹12,000"
            />

            <PaymentRow
              name="Internet"
              date="Sep 22"
              amount="₹999"
            />

            <PaymentRow
              name="Netflix"
              date="Sep 28"
              amount="₹649"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetRow({
  name,
  spent,
  budget,
}: {
  name: string;
  spent: number;
  budget: number;
}) {
  const percentage = Math.round((spent / budget) * 100);
  const exceeded = spent > budget;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{name}</span>

        <span
          className={
            exceeded
              ? "font-medium text-amber-600"
              : "text-slate-500"
          }
        >
          ₹{spent.toLocaleString()} / ₹{budget.toLocaleString()}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            exceeded ? "bg-amber-500" : "bg-slate-800"
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <p className="mt-1 text-right text-xs text-slate-400">
        {percentage}% used
      </p>
    </div>
  );
}

function PaymentRow({
  name,
  date,
  amount,
}: {
  name: string;
  date: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {date}
        </p>
      </div>

      <p className="text-sm font-semibold text-slate-900">
        {amount}
      </p>
    </div>
  );
}