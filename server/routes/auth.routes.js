import { Router } from "express";
import {
  isUserAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import userAuth from "../middlewares/user.middleware.js";

const authRouter = Router();

// User auth routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// User verification routes
authRouter.post("/verification-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.post("/is-authenticated", userAuth, isUserAuthenticated);

// Reset Password routes
authRouter.post("/send-reset-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
export default authRouter;
