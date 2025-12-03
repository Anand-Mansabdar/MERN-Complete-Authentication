import { Router } from "express";
import {
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


export default authRouter;
