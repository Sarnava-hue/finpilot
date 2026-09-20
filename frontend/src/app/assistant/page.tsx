"use client";

import { FormEvent, useRef, useState } from "react";
import {
  ArrowUp,
  Bot,
  CheckCircle2,
  Clock3,
  Sparkles,
  User,
} from "lucide-react";

import { ChatMessage } from "@/types/chat";

const suggestedQuestions = [
  "Where did I spend the most this month?",
  "Which subscriptions am I paying for?",
  "What expenses increased compared with last month?",
  "How much of my budget is already committed?",
  "How am I progressing toward my goals?",
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm FinPilot. I can help you understand your spending, budgets, recurring payments, upcoming obligations, and financial goals.",
    timestamp: "",
  },
];

export default function AssistantPage() {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageIdRef = useRef(0);

  async function sendMessage(question?: string) {
  const text = (question ?? input).trim();

  if (!text || isLoading) return;

  messageIdRef.current += 1;

  const userMessageId = `user-${messageIdRef.current}`;

  const userMessage: ChatMessage = {
    id: userMessageId,
    role: "user",
    content: text,
    timestamp: new Date().toISOString(),
  };

  setMessages((current) => [...current, userMessage]);
  setInput("");
  setIsLoading(true);

  // Temporary mock response.
  // This will later call Member 1's backend:
  // POST /api/chat

  setTimeout(() => {
    messageIdRef.current += 1;

    const assistantMessage: ChatMessage = {
      id: `assistant-${messageIdRef.current}`,
      role: "assistant",
      content: generateMockResponse(text),
      timestamp: new Date().toISOString(),
    };

    setMessages((current) => [
      ...current,
      assistantMessage,
    ]);

    setIsLoading(false);
  }, 900);
}

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900">
            <Sparkles size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              FinPilot AI
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Ask questions about your financial activity.
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 md:flex">
            <CheckCircle2
              size={15}
              className="text-emerald-600"
            />

            <span className="text-xs font-medium text-emerald-700">
              Financial data connected
            </span>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
              />
            ))}

            {isLoading && <TypingIndicator />}
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-10">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-slate-500" />

                <p className="text-sm font-semibold text-slate-700">
                  Try asking
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-600 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white px-4 py-5 md:px-8">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 p-2 focus-within:border-slate-500"
          >
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder="Ask FinPilot about your finances..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp size={18} />
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-slate-400">
            FinPilot provides financial data insights and decision support,
            not investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  message,
}: {
  message: ChatMessage;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900">
          <Bot size={17} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-slate-900 text-white"
            : "border border-slate-200 bg-white text-slate-700 shadow-sm"
        }`}
      >
        <p className="whitespace-pre-line text-sm leading-6">
          {message.content}
        </p>

        <div
          className={`mt-2 flex items-center gap-1 text-[10px] ${
            isUser ? "text-slate-400" : "text-slate-400"
          }`}
        >
          <Clock3 size={11} />

          {formatTime(message.timestamp)}
        </div>
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200">
          <User size={17} className="text-slate-700" />
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900">
        <Bot size={17} className="text-white" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string) {
  if (!timestamp) {
    return "";
  }

  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateMockResponse(question: string) {
  const normalized = question.toLowerCase();

  if (
    normalized.includes("most") ||
    normalized.includes("spent")
  ) {
    return (
      "Based on your current financial data, Housing is your largest " +
      "expense category at approximately ₹12,000 this month. " +
      "Food is your next-largest category at ₹5,200."
    );
  }

  if (
    normalized.includes("subscription") ||
    normalized.includes("subscriptions")
  ) {
    return (
      "I detected 4 recurring subscriptions and services: Netflix " +
      "(₹649/month), Spotify (₹119/month), Amazon Prime " +
      "(₹299/month), and Jio (₹799/month). Together, these cost " +
      "approximately ₹1,866 per month."
    );
  }

  if (
    normalized.includes("increased") ||
    normalized.includes("increase") ||
    normalized.includes("last month")
  ) {
    return (
      "Compared with last month, your Food spending increased by " +
      "approximately 26%. Shopping also increased, while your " +
      "Entertainment spending remained relatively stable."
    );
  }

  if (
    normalized.includes("budget") ||
    normalized.includes("committed")
  ) {
    return (
      "Your current category budgets total ₹17,000, with approximately " +
      "₹14,050 already spent. That means around 82.6% of your current " +
      "budget allocation has been used."
    );
  }

  if (
    normalized.includes("goal") ||
    normalized.includes("saving")
  ) {
    return (
      "You currently have two active goals. Your New Laptop goal is " +
      "₹22,000 of ₹60,000, or about 36.7% complete. Your Emergency " +
      "Fund is ₹45,000 of ₹100,000, or 45% complete."
    );
  }

  return (
    "I can help you understand your spending, budgets, subscriptions, " +
    "upcoming obligations, and financial goals. Try asking me where " +
    "you spent the most, which subscriptions you have, or how your " +
    "spending changed compared with last month."
  );
}