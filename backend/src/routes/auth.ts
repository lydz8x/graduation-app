import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Student } from "../models/Student";
import { verifyToken } from "../middleware/auth";
import {
  IStudent,
  RegisterRequest,
  LoginRequest,
  VerifyTokenRequest,
} from "../types/student";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ROLE_KEY || ""
);

// Register
router.post(
  "/register",
  async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    const { nisn, name, birthPlace, birthDate, password } = req.body;

    try {
      const existingStudent = await Student.findOne({ nisn });

      if (existingStudent) {
        return res.status(400).json({ message: "NISN sudah terdaftar" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const generatedToken = crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();

      const newStudent = new Student({
        nisn,
        name,
        birthPlace,
        birthDate,
        password: hashedPassword,
        token: generatedToken,
      });

      await newStudent.save();

      res.status(201).json({ message: "Registrasi berhasil" });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
);

// Login
router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    const { nisn, password } = req.body;

    try {
      const student = await Student.findOne({ nisn });
      if (!student) {
        return res.status(404).json({ message: "NISN tidak ditemukan" });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Password salah" });
      }

      const token = jwt.sign(
        { id: student._id, nisn: student.nisn, role: student.role },
        process.env.JWT_SECRET || "",
        { expiresIn: "1d" }
      );

      res.status(200).json({
        token,
        student: {
          nisn: student.nisn,
          name: student.name,
          birthPlace: student.birthPlace,
          birthDate: student.birthDate,
          role: student.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
);

// Verify Token
interface AuthRequest extends Request {
  user?: {
    name: string;
    nisn: string;
    role?: string;
  };
}

router.post(
  "/verify-token",
  verifyToken,
  async (
    req: AuthRequest & Request<{}, {}, VerifyTokenRequest>,
    res: Response
  ) => {
    const { inputToken } = req.body;
    const nisn = req.user?.nisn;

    if (!nisn) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const student = await Student.findOne({ nisn });
      if (!student)
        return res.status(403).json({ message: "Siswa tidak ditemukan" });

      if (student.token !== inputToken) {
        return res.status(403).json({
          message: "Token salah. Silahkan cek ke Administrasi Sekolah",
        });
      }

      const filePath = `skl/${student.name}_${nisn}.pdf`;

      const { data, error } = await supabase.storage
        .from("skl")
        .createSignedUrl(filePath, 90);

      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Gagal generate link download SKL" });
      }

      res.status(200).json({ downloadUrl: data.signedUrl });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
);

// Get students data
router.get(
  "/students",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      console.log("Access denied: User is not admin");
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const students = await Student.find({ role: "student" }).select(
        "nisn name birthPlace birthDate token"
      );
      res.json({ students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Gagal mengambil data siswa" });
    }
  }
);

// Import
router.post("/import", verifyToken, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { students } = req.body;

  if (!Array.isArray(students)) {
    return res.status(400).json({ message: "Data tidak valid" });
  }

  let created = 0;
  for (const s of students) {
    const exists = await Student.findOne({ nisn: s.nisn });
    if (exists) continue;

    const nisn = String(s.nisn);
    const hashedPassword = await bcrypt.hash(nisn, 10);
    const generatedToken = crypto.randomBytes(4).toString("hex").toUpperCase();

    const newStudent = new Student({
      nisn: s.nisn,
      name: s.name,
      birthPlace: s.birthPlace,
      birthDate: s.birthDate,
      password: hashedPassword,
      token: generatedToken,
      role: "student",
    });

    await newStudent.save();
    created++;
  }

  res.json({ message: `${created} siswa berhasil ditambahkan` });
});

export default router;
