"use client";

import { useState } from "react";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/register";

export default function Registration() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
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

      alert("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-8 dark:bg-gray-900 dark:text-white">
      <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">Registration</h2>

      {/* Social Login */}
      <button className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2 rounded mb-3">
        <FaFacebookF />
        Connect with Facebook
      </button>

      <button className="flex items-center justify-center gap-2 w-full bg-gray-100 py-2 rounded mb-4 border dark:bg-gray-800 dark:border-gray-700 dark:text-white">
        <FcGoogle size={20} />
        Connect with Google
      </button>

      <p className="text-base mb-6 underline decoration-indigo-500/30 font-semibold text-gray-400 cursor-pointer dark:text-gray-500">
        Or login with email
      </p>

      <form className="space-y-4">

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Fullname
          </label>
          <input
            name="username"
            placeholder="Enter fullname"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Password
          </label>

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 dark:text-gray-200">
            Confirm Password
          </label>

          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword}
            </p>
          )}
        </div>

      </form>

      {/* Terms */}
      <label className="flex items-center gap-2 text-sm mt-3 dark:text-gray-300">
        <input
          type="checkbox"
          name="agree"
          checked={form.agree}
          onChange={handleChange}
        />
        I agree to Terms & Conditions
      </label>

      {errors.agree && (
        <p className="text-red-500 text-sm">{errors.agree}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded mt-4"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}