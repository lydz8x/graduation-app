import mongoose, { Schema } from "mongoose";
import { IStudent } from "../types/student";

const studentSchema = new Schema<IStudent>({
  nisn: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  birthPlace: { type: String, required: true },
  birthDate: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  sklFile: { type: String, default: "" },
  role: { type: String, enum: ["student", "admin"], default: "student" },
});

export const Student = mongoose.model<IStudent>("Student", studentSchema);
