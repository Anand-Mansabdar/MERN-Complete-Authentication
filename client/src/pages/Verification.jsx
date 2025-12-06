import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Verification = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const { backendUrl, setIsLoggedIn, getUserData, userData, isLoggedIn } =
    useContext(AppContext);

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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      console.log("Entered OTP:", otp);

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);
  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-200 to-rose-200">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Verify Your Email
        </h1>
        <p className="text-center mb-6 text-indigo-400">
          Please enter the verification code sent to your email.
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
        <button className="w-full py-3 bg-linear-to-r from-blue-800 to-indigo-700 rounded-lg text-lg font-semibold text-blue-100">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default Verification;
