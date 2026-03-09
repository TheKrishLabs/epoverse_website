"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
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

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await fetch(
        "https://project-epoverse-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      console.log("Login success:", data);
      alert("Login successful!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* BLUR BACKGROUND */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-8 z-10">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
        >
          <X size={16} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* FACEBOOK */}
        <button className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-700 transition">
          <FaFacebookF />
          Connect with Facebook
        </button>

        {/* GOOGLE */}
        <button className="flex items-center justify-center gap-2 w-full bg-gray-100 py-2 rounded mb-4 border hover:bg-gray-200 transition">
          <FcGoogle size={20} />
          Connect with Google
        </button>

        <p className="text-sm text-center mb-6">
          Or{" "}
          <span className="underline cursor-pointer">register with email</span>
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="text-right text-sm text-red-500 mt-2 cursor-pointer hover:underline">
          Forgot password?
        </div>

        {/* LOGIN BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded mt-6 hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
