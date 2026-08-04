// src/app/auth/sign-up/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          company_name: form.companyName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
          <p className="text-gray-500 mb-6">
            We sent a confirmation link to <strong>{form.email}</strong>. Click the
            link to activate your account.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-block px-6 py-3 bg-[#1c51a3] text-white font-bold rounded-lg hover:bg-[#163d7d] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold text-[#1c51a3]">
            MTC Supply Hub
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create your account</h1>
          <p className="text-gray-500 mt-1">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-[#1c51a3] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-4"
        >
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <GoogleSignInButton label="Sign up with Google" />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {[
            { id: "fullName", label: "Full Name", type: "text", placeholder: "Jane Smith", autoComplete: "name" },
            { id: "companyName", label: "Company / Restaurant Name", type: "text", placeholder: "Smiths Diner LLC", autoComplete: "organization" },
            { id: "email", label: "Email Address", type: "email", placeholder: "you@company.com", autoComplete: "email" },
            { id: "password", label: "Password", type: "password", placeholder: "Min. 8 characters", autoComplete: "new-password" },
            { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat password", autoComplete: "new-password" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                required
                value={form[field.id as keyof typeof form]}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2561bb] text-gray-900"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1c51a3] text-white font-bold rounded-lg hover:bg-[#163d7d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By signing up you agree to our{" "}
            <Link href="/privacy" className="text-[#1c51a3] hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
