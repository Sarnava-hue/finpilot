"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  X,
} from "lucide-react";

import {
  uploadCsv,
  uploadPdf,
  UploadResult,
} from "@/lib/api";


export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");

  function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    const extension = selectedFile.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["csv", "pdf"].includes(extension || "")) {
      alert("Please upload a CSV or PDF file.");
      return;
    }

    setFile(selectedFile);
    setCompleted(false);
    setResult(null);
    setError("");
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    handleFile(droppedFile);
  }

  async function processFile() {
    if (!file) return;

    setProcessing(true);
    setCompleted(false);
    setResult(null);
    setError("");

    try {
      const extension = file.name
        .split(".")
        .pop()
        ?.toLowerCase();

      let response: UploadResult;

      if (extension === "pdf") {
        response = await uploadPdf(file);
      } else {
        response = await uploadCsv(file);
      }

      setResult(response);
      setCompleted(true);
    } catch (err) {
      console.error("Upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload the statement."
      );
    } finally {
      setProcessing(false);
    }
  }

  function removeFile() {
    setFile(null);
    setCompleted(false);
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const imported = result?.imported ?? 0;
  const failed = result?.failed ?? 0;

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
            accept=".csv,.pdf"
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
          </div>
        </div>

        {/* Selected file */}
        {file && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-slate-100 p-3">
                  {file.name.toLowerCase().endsWith(".pdf") ? (
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
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeFile();
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {!completed && !error && (
              <button
                type="button"
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

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Upload failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={processFile}
                  className="mt-3 text-sm font-semibold text-red-700 hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            )}

            {completed && result && (
              <div className="mt-5 rounded-xl bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Statement processed successfully
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      {result.message ||
                        `${imported} transactions imported successfully.`}
                    </p>

                    <div className="mt-3 flex gap-4 text-xs text-emerald-700">
                      <span>
                        Imported: <strong>{imported}</strong>
                      </span>

                      <span>
                        Failed: <strong>{failed}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {result.errors && result.errors.length > 0 && (
                  <div className="mt-3 rounded-lg bg-white/70 p-3">
                    <p className="text-xs font-semibold text-slate-700">
                      Processing notes
                    </p>

                    <ul className="mt-1 list-disc pl-5 text-xs text-slate-600">
                      {result.errors.slice(0, 5).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

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