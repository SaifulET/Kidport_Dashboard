import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { apiPost } from "../../../lib/api";

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const email = sessionStorage.getItem("passwordResetEmail");
    if (!email) {
      setError("Please request a password reset code again");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiPost("/auth/verify-reset-otp", {
        email,
        otp: code.join("")
      });
      navigate("/new-password");
    } catch (error) {
      setError(error.message || "Invalid or expired code");
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
            Verify Access
          </h2>
          <p className="text-[14px] text-[#64748b] font-medium text-center">
            Enter the 4-digit code sent to your email
          </p>
        </div>

        {/* Form section */}
        <form onSubmit={handleVerify}>
          {error && (
            <div className="mb-5 text-red-600 text-[13px] font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="mb-8">
            <label className="block text-[13px] font-semibold text-[#475569] mb-3">
              4-Digit Code
            </label>
            <div className="flex justify-between gap-2">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={code[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-lg font-bold text-center text-[#1e293b] bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/20 focus:border-[#06b6d4] transition-all shadow-sm"
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={loading || code.some(c => !c)}
              className="w-full h-11 bg-[#06b6d4] hover:bg-[#0891b2] text-white font-bold text-[14px] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : "Verify Code"}
            </button>
          </div>

          <div className="mb-8 text-center">
            <p className="text-[13px] font-medium text-[#64748b]">
              Didn't receive the email?{" "}
              <button type="button" className="text-[#06b6d4] hover:text-[#0891b2] font-semibold transition-colors ml-1">Resend Code</button>
            </p>
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

export default VerifyCode;
