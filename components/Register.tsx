"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RegisterProps {
  callbackUrl?: string;
}

export default function RegisterPage({ callbackUrl = "/dashboard" }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple frontend validation before even hitting the API
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res?.ok) {
        toast.error(data.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Logging you in...");

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: callbackUrl,
      });

      if (result?.error) {
        toast.error("Account created, but automatic login failed. Please login manually.");
        router.push(`/login?callbackUrl=${callbackUrl}`);
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: callbackUrl });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-start justify-center bg-gray-50 dark:bg-[#0d0d10] p-4 pt-12 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-lg">
        <div className="p-5">
          {/* Heading */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-0.5 text-xs">
              Start your learning journey today
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-zinc-400">Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-0.5 w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-zinc-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-zinc-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed transition text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                {isLoading ? "Wait..." : "Create"}
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-sm font-semibold border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-sm"
                onClick={handleGoogleSignup}
                type="button"
                disabled={isLoading}
              >
                {!isLoading && (
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                    alt="Google"
                  />
                )}
                {isLoading ? "Wait..." : "Google"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 dark:text-zinc-400 text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
