const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `API ${response.status}: ${text || response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

function periodQuery(year?: number, month?: number) {
  const query = new URLSearchParams();

  if (year !== undefined) {
    query.set("year", String(year));
  }

  if (month !== undefined) {
    query.set("month", String(month));
  }

  const value = query.toString();

  return value ? `?${value}` : "";
}

/* =========================
   TRANSACTIONS
========================= */

export interface Transaction {
  id: number;
  date: string;
  description: string;
  merchant: string | null;
  amount: number;
  transaction_type: "income" | "expense";
  category: string;
  source: string | null;
  confidence: number | null;
  created_at: string;
}

export async function getTransactions(params?: {
  transaction_type?: string;
  category?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}): Promise<Transaction[]> {
  const query = new URLSearchParams();

  if (params?.transaction_type) {
    query.set("transaction_type", params.transaction_type);
  }

  if (params?.category) {
    query.set("category", params.category);
  }

  if (params?.search) {
    query.set("search", params.search);
  }

  if (params?.start_date) {
    query.set("start_date", params.start_date);
  }

  if (params?.end_date) {
    query.set("end_date", params.end_date);
  }

  const queryString = query.toString();

  return request<Transaction[]>(
    `/api/transactions${queryString ? `?${queryString}` : ""}`
  );
}

/* =========================
   UPLOAD
========================= */

export interface UploadResult {
  filename?: string;
  imported?: number;
  failed?: number;
  errors?: string[];
  message?: string;
}

export async function uploadCsv(file: File): Promise<UploadResult> {
  const formData = new FormData();

  formData.append("file", file);

  return request<UploadResult>("/api/upload/csv", {
    method: "POST",
    body: formData,
  });
}

export async function uploadPdf(file: File): Promise<UploadResult> {
  const formData = new FormData();

  formData.append("file", file);

  return request<UploadResult>("/api/upload/pdf", {
    method: "POST",
    body: formData,
  });
}

export async function previewPdf(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  return request("/api/upload/pdf/preview", {
    method: "POST",
    body: formData,
  });
}

/* =========================
   DASHBOARD
========================= */

export async function getDashboard(
  year?: number,
  month?: number
) {
  return request(
    `/api/dashboard${periodQuery(year, month)}`
  );
}

/* =========================
   ANALYTICS
========================= */

export async function getMonthlyAnalytics(
  year?: number,
  month?: number
) {
  return request(
    `/api/analytics/monthly${periodQuery(year, month)}`
  );
}

export async function compareMonthlyAnalytics(
  year?: number,
  month?: number
) {
  return request(
    `/api/analytics/monthly/compare${periodQuery(year, month)}`
  );
}

/* =========================
   RECURRING
========================= */

export async function getRecurring() {
  return request("/api/recurring");
}

export async function getUpcomingRecurring() {
  return request("/api/recurring/upcoming");
}

/* =========================
   ANOMALIES
========================= */

export async function getSpendingAnomalies() {
  return request("/api/anomalies/spending");
}

/* =========================
   BUDGETS
========================= */

export async function getBudgets() {
  return request("/api/budgets");
}

export async function getBudgetStatus(
  year?: number,
  month?: number
) {
  return request(
    `/api/budgets/status${periodQuery(year, month)}`
  );
}

/* =========================
   GOALS
========================= */

export async function getGoals() {
  return request("/api/goals");
}

export async function getGoalProgress(
  goalId: number | string
) {
  return request(`/api/goals/${goalId}/progress`);
}

export async function getGoalImpact(
  goalId: number | string
) {
  return request(`/api/goals/${goalId}/impact`);
}

/* =========================
   UPCOMING
========================= */

export async function getUpcoming() {
  return request("/api/upcoming");
}

/* =========================
   AI ASSISTANT
========================= */

export async function askAgent(
  question: string,
  year: number,
  month: number
) {
  return request("/api/agent/ask", {
    method: "POST",
    body: JSON.stringify({
      question,
      year,
      month,
    }),
  });
}

export async function getMonthlyAISummary(
  year: number,
  month: number
) {
  return request(
    `/api/agent/monthly-summary${periodQuery(year, month)}`
  );
}

/* =========================
   DECISION SUPPORT
========================= */

export async function getDecisionSupport(
  year?: number,
  month?: number
) {
  return request(
    `/api/decision-support${periodQuery(year, month)}`
  );
}