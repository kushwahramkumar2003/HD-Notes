import { Router } from "express";
import passport from "passport";
import {
  sendOtp,
  verifyOtpAndSignup,
  sendOtpForLogin,
  verifyOtpAndLogin,
  getUserInfo,
} from "../controllers/authController";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/send-otp-signup", sendOtp);
router.post("/verify-otp-signup", verifyOtpAndSignup);
router.post("/send-otp-login", sendOtpForLogin);
router.post("/verify-otp-login", verifyOtpAndLogin);
router.get("/me", getUserInfo);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/signin",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: (req.user as any).id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.redirect(`https://hd-notes.vercel.app/auth?token=${token}`);
  }
);

export default router;
