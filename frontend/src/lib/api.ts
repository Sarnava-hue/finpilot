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

export async function getDashboard() {
  return request("/dashboard");
}

export async function getTransactions() {
  return request("/transactions");
}

export async function getBudgets() {
  return request("/budget");
}

export async function getGoals() {
  return request("/goals");
}

export async function getRecurring() {
  return request("/recurring");
}

export async function getUpcoming() {
  return request("/upcoming");
}

export async function getAnalytics() {
  return request("/analytics");
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/upload", {
    method: "POST",
    body: formData,
  });
}

export async function sendChatMessage(message: string) {
  return request("/agent", {
    method: "POST",
    body: JSON.stringify({
      message,
    }),
  });
}