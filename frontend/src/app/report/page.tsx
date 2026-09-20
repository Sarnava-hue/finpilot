"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  AlertTriangle,
  Download,
} from "lucide-react";

import { monthlyReport } from "@/data/report";
import { budgets } from "@/data/budgets";
import { subscriptions } from "@/data/subscriptions";
import { obligations } from "@/data/obligations";
import { goals } from "@/data/goals";

export default function ReportPage() {
  const savingsRate =
    (monthlyReport.savings / monthlyReport.income) * 100;

  const expenseChange =
    ((monthlyReport.expenses -
      monthlyReport.previousMonthExpenses) /
      monthlyReport.previousMonthExpenses) *
    100;

  const subscriptionCost = subscriptions
    .filter((subscription) => subscription.frequency === "monthly")
    .reduce((sum, subscription) => sum + subscription.amount, 0);

  const committedAmount = obligations.reduce(
    (sum, obligation) => sum + obligation.amount,
    0
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-slate-500" />

            <p className="text-sm font-medium text-slate-500">
              Monthly financial report
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {monthlyReport.month}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            A complete overview of your income, spending, budgets,
            recurring payments, upcoming obligations, and financial goals.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Download size={17} />
          Export Report
        </button>
      </div>

      {/* Financial overview */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Income"
          value={`₹${formatNumber(monthlyReport.income)}`}
          description="Total recorded income"
          icon={<TrendingUp size={20} />}
        />

        <MetricCard
          title="Expenses"
          value={`₹${formatNumber(monthlyReport.expenses)}`}
          description={`${expenseChange.toFixed(1)}% vs last month`}
          icon={<ArrowUpRight size={20} />}
          warning={expenseChange > 0}
        />

        <MetricCard
          title="Savings"
          value={`₹${formatNumber(monthlyReport.savings)}`}
          description="Income minus expenses"
          icon={<Target size={20} />}
        />

        <MetricCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          description="Of recorded income"
          icon={<TrendingUp size={20} />}
        />
      </div>

      {/* Spending + insights */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div>
            <h2 className="font-semibold text-slate-900">
              Spending Breakdown
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Where your money went this month.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {monthlyReport.categories.map((category) => (
              <CategoryRow
                key={category.name}
                name={category.name}
                amount={category.amount}
                percentage={category.percentage}
                change={category.change}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <Lightbulb size={20} className="text-slate-700" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Key Observations
              </h2>

              <p className="text-xs text-slate-500">
                Things worth reviewing
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {monthlyReport.observations.map((observation) => (
              <Observation
                key={observation.title}
                title={observation.title}
                description={observation.description}
                type={observation.type}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Budget section */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-slate-900">
            Budget Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            How actual spending compared with your monthly limits.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => {
            const percentage = Math.round(
              (budget.spent / budget.limit) * 100
            );

            const exceeded = budget.spent > budget.limit;

            return (
              <div
                key={budget.id}
                className="rounded-xl bg-slate-50 p-4"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {budget.category}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      exceeded
                        ? "text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      exceeded
                        ? "bg-amber-500"
                        : "bg-slate-800"
                    }`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-slate-400">
                    ₹{formatNumber(budget.spent)} spent
                  </span>

                  <span className="text-slate-400">
                    ₹{formatNumber(budget.limit)} limit
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recurring + obligations */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Subscriptions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recurring Payments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Detected subscriptions and services.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              ₹{formatNumber(subscriptionCost)}/month
            </span>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {subscription.merchant}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {subscription.frequency}
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  ₹{formatNumber(subscription.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Upcoming Obligations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Financial commitments coming up.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              ₹{formatNumber(committedAmount)}
            </span>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {obligations.slice(0, 4).map((obligation) => (
              <div
                key={obligation.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {obligation.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(obligation.dueDate)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  ₹{formatNumber(obligation.amount)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Goals */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-slate-900">
            Goal Progress
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Progress toward your current financial goals.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {goals.map((goal) => {
            const progress = Math.min(
              Math.round(
                (goal.currentAmount / goal.targetAmount) * 100
              ),
              100
            );

            return (
              <div
                key={goal.id}
                className="rounded-xl bg-slate-50 p-5"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {goal.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      ₹{formatNumber(goal.currentAmount)} of ₹
                      {formatNumber(goal.targetAmount)}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-700">
                    {progress}%
                  </span>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-800"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Action items */}
      <section className="mt-6 rounded-2xl bg-slate-900 p-7 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <Lightbulb size={20} />
          </div>

          <div>
            <h2 className="font-semibold">
              FinPilot Action Items
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Data-driven observations for the month.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ActionItem
            number="01"
            text="Review your increased food spending."
          />

          <ActionItem
            number="02"
            text="Keep enough funds available for upcoming obligations."
          />

          <ActionItem
            number="03"
            text="Review recurring subscriptions periodically."
          />
        </div>
      </section>

      {/* Disclaimer */}
      <p className="mt-6 text-center text-xs text-slate-400">
        FinPilot provides financial data analysis and decision support.
        It does not provide investment or financial advice.
      </p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
  warning = false,
}: {
  title: string;
  value: string;
  description: string;
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

      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p
        className={`mt-1 text-xs ${
          warning ? "text-amber-600" : "text-slate-400"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function CategoryRow({
  name,
  amount,
  percentage,
  change,
}: {
  name: string;
  amount: number;
  percentage: number;
  change: number;
}) {
  const increased = change > 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {percentage}% of total spending
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">
            ₹{formatNumber(amount)}
          </p>

          <div
            className={`mt-1 flex items-center justify-end gap-1 text-xs ${
              increased ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {increased ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}

            {Math.abs(change)}%
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-800"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function Observation({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type: string;
}) {
  const isAttention = type === "attention";
  const isPositive = type === "positive";

  return (
    <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
      <div className="mt-0.5">
        {isAttention ? (
          <AlertTriangle
            size={17}
            className="text-amber-600"
          />
        ) : isPositive ? (
          <CheckCircle2
            size={17}
            className="text-emerald-600"
          />
        ) : (
          <Lightbulb
            size={17}
            className="text-slate-500"
          />
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function ActionItem({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-xs font-semibold text-slate-400">
        {number}
      </p>

      <p className="mt-2 text-sm leading-5 text-slate-100">
        {text}
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
function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}