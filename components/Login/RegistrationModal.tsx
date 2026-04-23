"use client";

import { useState } from "react";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { X } from "lucide-react";
import { registerUser } from "@/services/register";
import { useToast } from "@/components/ui/ToastProvider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

export default function RegistrationModal({ isOpen, onClose, onSwitchToLogin }: Props) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    let newErrors: any = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.agree) {
      newErrors.agree = "You must accept Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await registerUser({
        fullName: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else {
          onClose();
        }
      }, 2000);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 md:pt-24 px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-[480px] min-h-[660px] p-8 z-10 border border-gray-200 dark:border-gray-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center min-h-[580px]">
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
            <h3 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-3">Registration Successful</h3>
            <div className="w-16 h-1 bg-[#e43f3e] mb-4"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Taking you to login...</p>
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
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-2">Register</h2>
              <div className="w-16 h-1 bg-[#e43f3e] mx-auto"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white py-3 px-4 font-bold text-sm uppercase tracking-wider transition-colors rounded-none">
                <FaFacebookF />
                Facebook
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-3 px-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-sm uppercase tracking-wider transition-colors rounded-none">
                <FcGoogle size={18} />
                Google
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative bg-white dark:bg-[#0a0a0a] px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Or register with email
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  name="username"
                  placeholder="Enter your name"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#e43f3e] dark:focus:border-[#e43f3e] text-sm dark:text-white transition-colors placeholder-gray-400 rounded-none"
                />
                {errors.username && (
                  <p className="text-[#e43f3e] text-xs mt-1 font-medium">{errors.username}</p>
                )}
              </div>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#e43f3e] dark:focus:border-[#e43f3e] text-sm dark:text-white transition-colors placeholder-gray-400 rounded-none"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[#e43f3e] text-xs mt-1 font-medium">{errors.password}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Confirm
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900 focus:outline-none focus:border-[#e43f3e] dark:focus:border-[#e43f3e] text-sm dark:text-white transition-colors placeholder-gray-400 rounded-none"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[#e43f3e] text-xs mt-1 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </form>

            <div className="mt-6 mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 peer-checked:bg-[#e43f3e] peer-checked:border-[#e43f3e] transition-colors rounded-none"></div>
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 select-none">
                  I agree to the <span className="text-black dark:text-white font-bold hover:text-[#e43f3e] transition-colors">Terms of Service</span> and <span className="text-black dark:text-white font-bold hover:text-[#e43f3e] transition-colors">Privacy Policy</span>
                </span>
              </label>
              {errors.agree && (
                <p className="text-[#e43f3e] text-xs mt-2 font-medium">{errors.agree}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#e43f3e] hover:bg-black dark:hover:bg-white dark:hover:text-black text-white font-bold uppercase tracking-wider text-sm py-3 mt-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-none"
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
              Already have an account?{" "}
              <button
                onClick={() => {
                  if (onSwitchToLogin) {
                    onSwitchToLogin();
                  }
                }}
                className="text-[#e43f3e] font-bold hover:text-black dark:hover:text-white transition-colors uppercase tracking-wider text-xs ml-1"
              >
                Sign In
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
