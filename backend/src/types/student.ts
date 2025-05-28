import { Document } from "mongoose";

export interface IStudent extends Document {
  nisn: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  password: string;
  token: string;
  sklFile: string;
  role: string;
}

export interface IStudentResponse {
  nisn: string;
  name: string;
}

export interface RegisterRequest {
  nisn: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  nisn: string;
  password: string;
}

export interface VerifyTokenRequest {
  inputToken: string;
}
