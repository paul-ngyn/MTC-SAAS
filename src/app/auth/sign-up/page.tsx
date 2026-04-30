// src/app/auth/sign-up/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
          <p className="text-gray-500 mb-6">
            We sent a confirmation link to <strong>{form.email}</strong>. Click the
            link to activate your account.
          </p>
          <Link
            href="/auth/sign-in"
            className="inline-block px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
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
          <Link href="/" className="text-3xl font-extrabold text-orange-600">
            MTC Supply Hub
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create your account</h1>
          <p className="text-gray-500 mt-1">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-orange-600 font-semibold hover:underline">
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By signing up you agree to our{" "}
            <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
}
