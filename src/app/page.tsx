"use client";

import { useState } from "react";
import UserIdInput from "@/components/UserIdInput";
import RSSDisplay from "@/components/RSSDisplay";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserIdSubmit = async (inputUserId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/rss/${inputUserId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate RSS feed");
      }

      setUserId(inputUserId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setUserId(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>

      <div className="relative">
        <main className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-100 mb-6 tracking-tight">
              Comick RSS Generator
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Transform your Comick.io follows into a personalized RSS feed.
              Stay updated with the latest manga and manhwa chapters through
              your favorite RSS reader.
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-red-900/30 border border-red-800/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0"
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
                  <div>
                    <p className="font-medium">Error occurred</p>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userId ? (
            <RSSDisplay userId={userId} onBack={handleBack} />
          ) : (
            <UserIdInput onSubmit={handleUserIdSubmit} loading={loading} />
          )}
        </main>
      </div>
    </div>
  );
}
