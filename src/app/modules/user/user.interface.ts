import { Types } from "mongoose";

export enum Role {
  "AGENT" = "AGENT",
  "ADMIN" = "ADMIN",
  "USER" = "USER",
}

export enum Status {
  "ACTIVE" = "ACTIVE",
  "SUSPENDED" = "SUSPENDED",
  "BLOCKED" = "BLOCKED",
}
export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export interface IUSER {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  isEmailVerified?: boolean;
  password?: string;
  phone?: string;
  isPhoneVerified?: boolean;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: Status;
  role?: Role;
  auths?: IAuthProvider[];
  loginAttempts?: number;
  lastLogin?: Date;
}
