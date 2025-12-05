import { Router } from "express";
import {
  isUserAuthenticated,
  login,
  logout,
  register,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import userAuth from "../middlewares/user.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/verification-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.post("/is-authenticated", userAuth, isUserAuthenticated);

export default authRouter;
