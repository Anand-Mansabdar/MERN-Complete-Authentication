import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen px-6 sm:p-0 bg-linear-to-br from-blue-200 to-rose-200">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-400 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Welcome back! Please login"}
        </p>

        <form action="">
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="Person Icon" />
              <input
                className="bg-transparent outline-none"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              className="bg-transparent outline-none"
              type="text"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              className="bg-transparent outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <p
            className="mb-4 text-indigo-400 cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            Forgot password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-linear-to-r from-indigo-400 to-indigo-700 text-white">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-neutral-400 text-center text-xs mt-4">
            Already have an account ?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-500 underline hover:cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-neutral-400 text-center text-xs mt-4">
            Don't have an account ?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-500 underline hover:cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
