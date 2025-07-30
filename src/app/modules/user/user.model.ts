import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUSER, Role } from "./user.interface";
import { boolean, string } from "zod";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUSER>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },

    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    auths: [authProviderSchema],
    isDeleted: { type: Boolean, default: false },
  },

  { versionKey: false, timestamps: true }
);

export const User = model<IUSER>("User", userSchema);
