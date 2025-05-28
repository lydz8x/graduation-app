import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    id: string;
    nisn: string;
    role: string;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
      nisn: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      nisn: decoded.nisn,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};
