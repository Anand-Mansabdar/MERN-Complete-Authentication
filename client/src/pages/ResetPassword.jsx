import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const { backendUrl } = useContext(AppContext);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasteData = e.clipboardData.getData("text");
    const pasteValues = pasteData.split("");
    pasteValues.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const emailSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        {
          email,
        }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);

      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const otpSubmitHandler = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const enteredOtp = otpArray.join("");
    setOtp(enteredOtp);
    setIsOtpSubmitted(true);
  };

  const newPasswordSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-200 to-rose-200">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {!isEmailSent && (
        <form
          onSubmit={emailSubmitHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Your Password
          </h1>
          <p className="text-center mb-6 text-indigo-400">
            Enter your email address below to receive a password reset link.
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333a4c]">
            <img src={assets.mail_icon} alt="Email Icon" className="w-3 h-3" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="bg-transparent outline-none placeholder:text-cyan-100 text-cyan-50 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            Submit
          </button>
        </form>
      )}

      {/* Form for adding OTP */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={otpSubmitHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            OTP Verification
          </h1>
          <p className="text-center mb-6 text-indigo-400">
            Please enter the OTP sent to your email.
          </p>
          <div className="flex justify-between mb-8" onPaste={handleOtpPaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 rounded-lg bg-[#333A5C] border-none outline-none text-white text-center text-xl"
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-linear-to-r from-blue-800 to-indigo-700 rounded-lg text-lg font-semibold text-blue-100">
            Verify OTP
          </button>
        </form>
      )}

      {/* Form for entering new password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={newPasswordSubmitHandler}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Enter New Password
          </h1>
          <p className="text-center mb-6 text-indigo-400">
            Please enter your new password below.
          </p>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333a4c]">
            <img
              src={assets.lock_icon}
              alt="Password Icon"
              className="w-3 h-3"
            />
            <input
              type="password"
              placeholder="Enter your new password"
              className="bg-transparent outline-none placeholder:text-cyan-100 text-cyan-50 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            Change Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
