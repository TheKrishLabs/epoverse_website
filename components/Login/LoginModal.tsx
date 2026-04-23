"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "@/services/login";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onLogin: () => void;
  onClose: () => void;
  redirectTo?: string;
  onSwitchToRegister?: () => void;
};

export default function LoginModal({ isOpen, onLogin, onClose, redirectTo = "/", onSwitchToRegister }: Props) {
  const router = useRouter();
  const redirectPath = redirectTo || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!isOpen) return null;

  const validate = () => {
    let newErrors: typeof errors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setAuthError(null);
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setAuthError(null);
      setLoading(true);
      const data = await loginUser({ email: form.email, password: form.password });
      if (data?.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }
      setSuccess(true);
      setTimeout(() => {
        window.location.href = redirectPath;
        onLogin();
        onClose();
      }, 2000);
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || "Invalid email or password.");
      setForm(prev => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 md:pt-24 px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-[480px] min-h-[683px] p-8 z-10 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center min-h-[600px]">
            <div className="relative w-24 h-24 mb-8">
              <svg className="w-24 h-24" viewBox="0 0 96 96" fill="none">
                <circle
                  cx="48" cy="48" r="44"
                  stroke="#e43f3e"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="276.46"
                  strokeDashoffset="276.46"
                  style={{ animation: "circleDraw 0.6s ease-out 0.1s forwards" }}
                />
                <path
                  d="M28 50 L42 64 L68 34"
                  stroke="#e43f3e"
                  strokeWidth="5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  fill="none"
                  strokeDasharray="80"
                  strokeDashoffset="80"
                  style={{ animation: "checkDraw 0.4s ease-out 0.7s forwards" }}
                />
              </svg>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-3">Login Successful</h3>
            <div className="w-16 h-1 bg-[#e43f3e] mb-4"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Redirecting you now...</p>
            <style jsx>{`
              @keyframes circleDraw {
                to { stroke-dashoffset: 0; }
              }
              @keyframes checkDraw {
                to { stroke-dashoffset: 0; }
              }
            `}</style>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-1">Login</h2>
              <div className="w-12 h-1 bg-[#e43f3e]"></div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 py-3 mb-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FcGoogle size={20} />
              Continue with Google
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative bg-white dark:bg-[#0a0a0a] px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Or
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#e43f3e] dark:focus:border-[#e43f3e] text-sm dark:text-white transition-colors placeholder-gray-400 rounded-none"
                />
                {errors.email && (
                  <p className="text-[#e43f3e] text-xs mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="text-xs text-gray-500 hover:text-[#e43f3e] cursor-pointer transition-colors">
                    Forgot password?
                  </div>
                </div>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#e43f3e] dark:focus:border-[#e43f3e] text-sm dark:text-white transition-colors placeholder-gray-400 rounded-none"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[#e43f3e] text-xs mt-1 font-medium">{errors.password}</p>
                )}
              </div>
            </div>

            {authError && (
              <div className="mt-4 p-3 border border-[#e43f3e] bg-red-50 dark:bg-red-900/10 flex items-center gap-2" style={{ animation: "fadeIn 0.2s ease-out" }}>
                <AlertTriangle size={16} className="text-[#e43f3e] shrink-0" />
                <p className="text-[#e43f3e] text-xs font-bold uppercase tracking-wider">{authError}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#e43f3e] hover:bg-black dark:hover:bg-white dark:hover:text-black text-white font-bold uppercase tracking-wider text-sm py-3 mt-6 transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-none"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  if (onSwitchToRegister) {
                    onSwitchToRegister();
                  } else {
                    onClose();
                    router.push("/registration");
                  }
                }}
                className="text-[#e43f3e] font-bold cursor-pointer hover:text-black dark:hover:text-white transition-colors"
              >
                Create one
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
