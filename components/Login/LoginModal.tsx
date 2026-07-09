"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, QrCode } from "lucide-react";
import { FaFacebookF, FaEye, FaEyeSlash, FaApple, FaGooglePlay } from "react-icons/fa";
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#0f0f0f] w-full max-w-[800px] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Form */}
        <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col">
          {success ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative w-20 h-20 mb-6">
                <svg className="w-20 h-20" viewBox="0 0 96 96" fill="none">
                  <circle
                    cx="48" cy="48" r="44"
                    className="stroke-black dark:stroke-white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="276.46"
                    strokeDashoffset="276.46"
                    style={{ animation: "circleDraw 0.6s ease-out 0.1s forwards" }}
                  />
                  <path
                    d="M28 50 L42 64 L68 34"
                    className="stroke-black dark:stroke-white"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray="80"
                    strokeDashoffset="80"
                    style={{ animation: "checkDraw 0.4s ease-out 0.7s forwards" }}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Welcome Back</h3>
              <p className="text-[13px] text-gray-500 font-medium">Redirecting you now...</p>
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
            <div className="flex flex-col h-full">
              {/* Header */}
              <h2 className="text-[26px] font-bold text-black dark:text-white mb-8">Log in</h2>

              {/* Form Fields */}
              <div className="space-y-3 mb-6">
                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] px-4 py-3.5 focus:outline-none focus:border-black dark:focus:border-white text-[14px] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] px-4 py-3.5 focus:outline-none focus:border-black dark:focus:border-white text-[14px] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{errors.password}</p>
                  )}
                  <div className="flex justify-end mt-2">
                    <button className="text-[12px] font-semibold text-black dark:text-white hover:underline transition-all">
                      Forgot password?
                    </button>
                  </div>
                </div>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-red-500 text-[13px] font-medium">{authError}</p>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold text-[15px] py-3.5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed rounded-lg"
              >
                {loading ? "Logging in..." : "Continue"}
              </button>

              {/* Bottom Section */}
              <div className="mt-auto pt-8">
                <div className="border-t border-gray-100 dark:border-gray-800 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <button className="flex items-center justify-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                      <FaApple size={16} />
                      <div className="flex flex-col items-start leading-none text-left">
                        <span className="text-[7px] text-gray-300">Download on the</span>
                        <span className="text-[10px] font-medium">App Store</span>
                      </div>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
                      <FaGooglePlay size={14} />
                      <div className="flex flex-col items-start leading-none text-left">
                        <span className="text-[7px] text-gray-300">GET IT ON</span>
                        <span className="text-[10px] font-medium">Google Play</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="text-[13px] text-gray-500 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => {
                        if (onSwitchToRegister) {
                          onSwitchToRegister();
                        } else {
                          onClose();
                          router.push("/registration");
                        }
                      }}
                      className="text-black dark:text-white font-semibold hover:underline transition-all"
                    >
                      Create one
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: QR Code */}
        <div className="hidden md:flex w-full md:w-[45%] bg-[#fafafa] dark:bg-[#141414] border-l border-gray-200 dark:border-gray-800 p-8 flex-col items-center justify-center text-center">
          <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm mb-6">
            <QrCode size={140} strokeWidth={1.5} className="text-black dark:text-white" />
          </div>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 mb-1">Scan QR to</p>
          <h3 className="text-lg font-bold text-black dark:text-white leading-tight">Download the<br/>Epoverse app</h3>
        </div>
      </div>
    </div>
  );
}
