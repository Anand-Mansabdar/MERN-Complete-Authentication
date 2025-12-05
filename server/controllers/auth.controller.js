import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing Name or email or password",
    });
  }

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(401).json({
        success: false,
        message: `User already exists`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `${name} !!! Welcome to my MERN-Auth-project: You have created an account with email: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "User registered successfully",
      user: {
        email: email,
        userName: name,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Missing Name or email or password",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Sending Verification Otp to email
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(400).json({
        message: `User does not exist`,
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: `Account is already verified!!`,
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;

    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Account Verification OTP`,
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };

    await transporter.sendMail(mailOption);

    res.json({
      success: true,
      message: `Verification OTP sent on email`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.userId;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: `Provide missing details`,
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User not found`,
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: `Invalid OTP`,
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: `OTP expired`,
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Email Verified Successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if user is authenticated
export const isUserAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: `User is authenticated`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Sending password reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: `Please enter a valid email`,
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: `User not found`,
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;

    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Password Reset OTP`,
      text: `The OTP to reset your password is ${otp}. Reset your account password using this otp`,
    };

    await transporter.sendMail(mailOption);

    res.json({
      success: true,
      message: `Password resetting otp sent successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// Reset User Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields`,
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User not found`,
      });
    }

    if (user.resetOtp === "" || user.resetOtp != otp) {
      return res.status(400).json({
        success: false,
        message: `Invalid OTP`,
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: `OTP Expired`,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `Your password reset is successful`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
