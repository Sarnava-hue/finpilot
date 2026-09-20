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

// -----------------------------
// Transactions
// -----------------------------

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

// -----------------------------
// Upload
// -----------------------------

export async function uploadPdf(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  return request("/api/upload/pdf", {
    method: "POST",
    body: formData,
  });
}

// -----------------------------
// Dashboard
// -----------------------------

export async function getDashboard() {
  return request("/api/dashboard");
}

// -----------------------------
// Budgets
// -----------------------------

export async function getBudgets() {
  return request("/api/budgets");
}

// -----------------------------
// Goals
// -----------------------------

export async function getGoals() {
  return request("/api/goals");
}

// -----------------------------
// Recurring payments
// -----------------------------

export async function getRecurring() {
  return request("/api/recurring");
}

// -----------------------------
// Upcoming obligations
// -----------------------------

export async function getUpcoming() {
  return request("/api/upcoming");
}

// -----------------------------
// Analytics
// -----------------------------

export async function getAnalytics() {
  return request("/api/analytics");
}

// -----------------------------
// AI Agent
// -----------------------------

export async function sendChatMessage(message: string) {
  return request("/api/agent", {
    method: "POST",
    body: JSON.stringify({
      message,
    }),
  });
}