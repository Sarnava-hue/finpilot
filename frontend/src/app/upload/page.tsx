"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    const extension = selectedFile.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["csv", "pdf", "xlsx", "xls"].includes(extension || "")) {
      alert("Please upload a CSV, PDF, XLSX, or XLS file.");
      return;
    }

    setFile(selectedFile);
    setCompleted(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    handleFile(droppedFile);
  }

  function processFile() {
    if (!file) return;

    setProcessing(true);

    // Temporary simulation.
    // This will later call Member 1's backend.
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
    }, 1800);
  }

  function removeFile() {
    setFile(null);
    setCompleted(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          Data ingestion
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Upload Financial Data
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Upload a bank statement or expense record and FinPilot will
          analyze your transactions, recurring payments, spending patterns,
          and financial activity.
        </p>
      </div>

      {/* Upload area */}
      <div className="mt-8 max-w-3xl">
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-white px-8 py-16 text-center transition hover:border-slate-500 hover:bg-slate-50"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.pdf,.xlsx,.xls"
            className="hidden"
            onChange={(event) =>
              handleFile(event.target.files?.[0])
            }
          />

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <UploadCloud size={30} className="text-slate-700" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            Drop your financial statement here
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            or click to browse your computer
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              PDF
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              CSV
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              Excel
            </span>
          </div>
        </div>

        {/* Selected file */}
        {file && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-slate-100 p-3">
                  {file.name.endsWith(".pdf") ? (
                    <FileText size={22} className="text-slate-700" />
                  ) : (
                    <FileSpreadsheet
                      size={22}
                      className="text-slate-700"
                    />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {!processing && !completed && (
                <button
                  onClick={removeFile}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {!completed && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  processFile();
                }}
                disabled={processing}
                className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing
                  ? "Analyzing financial data..."
                  : "Analyze Statement"}
              </button>
            )}

            {completed && (
              <div className="mt-5 rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Statement analyzed successfully
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      342 transactions detected and ready to review.
                    </p>
                  </div>
                </div>

                <a
                  href="/transactions"
                  className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  View transactions →
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="mt-8 grid max-w-3xl gap-4 md:grid-cols-3">
        <InfoCard
          title="Categorization"
          description="Transactions are automatically organized into spending categories."
        />

        <InfoCard
          title="Recurring payments"
          description="FinPilot identifies subscriptions and repeating financial obligations."
        />

        <InfoCard
          title="Spending insights"
          description="Understand unusual spending and changes in your financial activity."
        />
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}