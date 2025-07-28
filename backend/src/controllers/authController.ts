import { type Request, type Response } from "express";

import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/otp";
import { sendOTP } from "../utils/email";
import prisma from "../utils/prisma";

const otpStore: Map<
  string,
  { otp: string; expires: Date; name?: string; dob?: string }
> = new Map();

export const sendOtp = async (req: Request, res: Response) => {
  const { email, name, dob } = req.body;
  if (!email || !name || !dob)
    return res.status(400).json({ error: "Missing required fields" });
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).json({ error: "Invalid email format" });

  const otp = generateOTP();
  otpStore.set(email, {
    otp,
    expires: new Date(Date.now() + 5 * 60 * 1000),
    name,
    dob,
  });

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtpAndSignup = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);
  if (!stored || stored.otp !== otp || stored.expires < new Date()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (user) return res.status(400).json({ error: "User already exists" });

  let dobDate: Date | null = null;
  if (stored.dob) {
    const dateValue = new Date(stored.dob);
    if (isNaN(dateValue.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    dobDate = dateValue;
  }

  user = await prisma.user.create({
    data: {
      email,
      name: stored.name,
      dob: dobDate,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  otpStore.delete(email);
  res.json({ token, user });
};

export const sendOtpForLogin = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  if (!/\S+@\S+\.\S+/.test(email))
    return res.status(400).json({ error: "Invalid email format" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = generateOTP();
  otpStore.set(email, { otp, expires: new Date(Date.now() + 5 * 60 * 1000) });

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtpAndLogin = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);
  if (!stored || stored.otp !== otp || stored.expires < new Date()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  otpStore.delete(email);
  res.json({ token, user });
};

export const getUserInfo = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ error: "Token verification failed" });
  }
};
