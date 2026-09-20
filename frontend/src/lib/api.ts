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
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `API ${response.status}: ${text || response.statusText}`
    );
  }

  return response.json();
}

/* =========================
   TRANSACTIONS
========================= */

export async function getTransactions(params?: {
  transaction_type?: string;
  category?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}) {
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

  return request(
    `/api/transactions${queryString ? `?${queryString}` : ""}`
  );
}

/* =========================
   UPLOAD
========================= */

export async function uploadCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/api/upload/csv", {
    method: "POST",
    body: formData,
  });
}

export async function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/api/upload/pdf", {
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

export async function getDashboard() {
  return request("/api/dashboard");
}

/* =========================
   ANALYTICS
========================= */

export async function getMonthlyAnalytics(params?: {
  year?: number;
  month?: number;
}) {
  const query = new URLSearchParams();

  if (params?.year !== undefined) {
    query.set("year", String(params.year));
  }

  if (params?.month !== undefined) {
    query.set("month", String(params.month));
  }

  const queryString = query.toString();

  return request(
    `/api/analytics/monthly${queryString ? `?${queryString}` : ""}`
  );
}

export async function compareMonthlyAnalytics(params?: {
  year?: number;
  month?: number;
}) {
  const query = new URLSearchParams();

  if (params?.year !== undefined) {
    query.set("year", String(params.year));
  }

  if (params?.month !== undefined) {
    query.set("month", String(params.month));
  }

  const queryString = query.toString();

  return request(
    `/api/analytics/monthly/compare${queryString ? `?${queryString}` : ""}`
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

export async function getBudgetStatus() {
  return request("/api/budgets/status");
}

/* =========================
   GOALS
========================= */

export async function getGoals() {
  return request("/api/goals");
}

export async function getGoalProgress(goalId: number | string) {
  return request(`/api/goals/${goalId}/progress`);
}

export async function getGoalImpact(goalId: number | string) {
  return request(`/api/goals/${goalId}/impact`);
}

/* =========================
   UPCOMING OBLIGATIONS
========================= */

export async function getUpcoming() {
  return request("/api/upcoming");
}

/* =========================
   AI AGENT
========================= */

export async function sendChatMessage(
  message: string,
  year?: number,
  month?: number
) {
  return request("/api/agent/ask", {
    method: "POST",
    body: JSON.stringify({
      question: message,
      year,
      month,
    }),
  });
}

export async function getMonthlyAISummary(
  year?: number,
  month?: number
) {
  const query = new URLSearchParams();

  if (year !== undefined) {
    query.set("year", String(year));
  }

  if (month !== undefined) {
    query.set("month", String(month));
  }

  const queryString = query.toString();

  return request(
    `/api/agent/monthly-summary${queryString ? `?${queryString}` : ""}`
  );
}

/* =========================
   DECISION SUPPORT
========================= */

export async function getDecisionSupport() {
  return request("/api/decision-support");
}