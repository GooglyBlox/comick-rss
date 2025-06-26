"use client";

import { useState } from "react";

interface RSSDisplayProps {
  userId: string;
  onBack: () => void;
}

export default function RSSDisplay({ userId, onBack }: RSSDisplayProps) {
  const [copied, setCopied] = useState(false);

  const rssUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/api/rss/${userId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rssUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Generator
      </button>

      <div className="card p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              RSS Feed Generated Successfully
            </h2>
            <p className="text-slate-400">
              Your personalized feed is ready to use
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              RSS Feed URL
            </label>
            <div className="flex rounded-xl overflow-hidden border border-slate-600">
              <input
                type="text"
                value={rssUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-200 text-sm font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center px-6 py-4 rounded-xl font-semibold"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Feed
            </a>

            <a
              href={`/api/rss/${userId}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center justify-center px-6 py-4 rounded-xl font-semibold"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview Feed
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span>How to Use</span>
          </h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Add the RSS URL to your favorite RSS reader application
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Receive automatic notifications for new chapter releases
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Feed updates automatically when new chapters are published
              </span>
            </li>
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-purple-400"
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
            <span>Feed Details</span>
          </h3>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Includes comic titles and chapter numbers</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Shows status and latest chapter information</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Updates every 5 minutes with fresh content</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
