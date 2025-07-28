import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import "./passport"; 
import { jwtMiddleware } from "./middleware/auth";
import authRoutes from "./routes/authRoutes";
import notesRoutes from "./routes/notesRoutes";

dotenv.config();

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
  ],
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
    "Expires",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  exposedHeaders: ["Content-Disposition"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/notes", jwtMiddleware, notesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
