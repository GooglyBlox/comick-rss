"use client";

import { useState } from "react";

interface UserIdInputProps {
  onSubmit: (userId: string) => void;
  loading: boolean;
}

export default function UserIdInput({ onSubmit, loading }: UserIdInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const extractUserId = (input: string): string | null => {
    const trimmed = input.trim();

    if (trimmed.includes("comick.io/user/")) {
      const match = trimmed.match(/comick\.io\/user\/([a-f0-9-]+)/);
      return match ? match[1] : null;
    }

    if (trimmed.match(/^[a-f0-9-]+$/)) {
      return trimmed;
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userId = extractUserId(input);
    if (!userId) {
      setError("Please enter a valid User ID or Comick.io list URL");
      return;
    }

    onSubmit(userId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="userId"
              className="block text-lg font-semibold text-slate-200 mb-3"
            >
              User ID or List URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="userId"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e2f5a172-c715-4299-9f2f-ba287a8d9b84 or https://comick.io/user/..."
                className="input-field w-full px-5 py-4 rounded-xl text-lg placeholder:text-slate-400 pr-12"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            </div>
            {error && (
              <p className="mt-3 text-red-400 text-sm flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary w-full px-8 py-4 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            <div className="flex items-center justify-center space-x-3">
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Generating RSS Feed...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
                    />
                  </svg>
                  <span>Generate RSS Feed</span>
                </>
              )}
            </div>
          </button>
        </form>
      </div>

      <div className="mt-8 card p-6">
        <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>How to find your User ID</span>
        </h3>
        <ol className="text-slate-400 space-y-2">
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <span>Navigate to your Comick.io profile or reading list page</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <span>Copy the complete URL from your browser address bar</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <span>Paste the URL here, or extract just the UUID portion</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
