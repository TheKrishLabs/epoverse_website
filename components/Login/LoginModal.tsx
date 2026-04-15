"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "@/services/login";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onLogin: () => void;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onLogin, onClose }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      // ✅ correct token store
      if (data?.accessToken) {
        localStorage.setItem("token", data.accessToken);
      }
      alert("Login successful!");

      router.push("/"); // redirect
      onLogin();
      onClose();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-8 z-10 dark:bg-gray-900 dark:text-white">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2"
        >
          <X size={16} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* GOOGLE */}
        <button className="flex items-center justify-center gap-2 w-full bg-gray-100 py-2 rounded mb-4 border dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <FcGoogle size={20} />
          Connect with Google
        </button>

        <p className="text-sm text-center mb-6">
          Or{" "}
          <span className="underline cursor-pointer">register with email</span>
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Email Address
          </label>

          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-2 relative">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">Password</label>

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="text-right text-sm text-red-500 mt-2 cursor-pointer hover:underline">
          Forgot password?
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded mt-6 hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
