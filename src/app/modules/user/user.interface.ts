import { Types } from "mongoose";

export enum Role {
  "SUPER_ADMIN" = "Super Admin",
  "ADMIN" = "Admin",
  "USER" = "User",
  "GUIDE" = "Guide",
}

export enum IsActive {
  "ACTIVE" = "ACTIVE",
  "INACTIVE" = "INACTIVE",
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
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  role?: Role;
  auths?: IAuthProvider[];
  booking?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
