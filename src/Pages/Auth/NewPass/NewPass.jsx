import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiPost } from "../../../lib/api";

const NewPass = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await apiPost("/auth/reset-password", {
        newPassword: password,
        confirmPassword
      });
      sessionStorage.removeItem("passwordResetEmail");
      navigate("/sign-in");
    } catch (error) {
      setError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center font-sans p-4">
      <div className="bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl w-full max-w-[420px] border border-gray-100">
        {/* Header section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            {/* Logo SVG Placeholder */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-400 rounded-full absolute bottom-0 left-0" style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}></div>
              <div className="w-3 h-3 bg-teal-400 rounded-full absolute top-0 left-1"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full absolute top-2 right-1"></div>
            </div>
            <span className="text-2xl font-bold text-[#1eb4cd] tracking-tight">KIDPort</span>
          </div>
          <h2 className="text-[22px] font-bold text-[#1e293b] leading-tight mb-1">
            New Password
          </h2>
          <p className="text-[14px] text-[#64748b] font-medium text-center">
            Create a secure new password
          </p>
        </div>

        {/* Form section */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-5 text-red-600 text-[13px] font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          {/* New Password Field */}
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-[#475569] mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 text-[14px] text-[#1e293b] placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/20 focus:border-[#06b6d4] transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-8">
            <label className="block text-[13px] font-semibold text-[#475569] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 px-4 text-[14px] text-[#1e293b] placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/20 focus:border-[#06b6d4] transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Action Button */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#06b6d4] hover:bg-[#0891b2] text-white font-bold text-[14px] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : "Reset Password"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-6 text-center flex justify-center">
          <Link to="/sign-in" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748b] hover:text-[#06b6d4] transition-colors">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewPass;
