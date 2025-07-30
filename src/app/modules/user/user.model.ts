import { model, Schema } from "mongoose";
import { IAuthProvider, IUSER, Role, Status } from "./user.interface";

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
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    auths: [authProviderSchema],
    isDeleted: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lastLogin: { type: Date },
  },

  { versionKey: false, timestamps: true }
);

export const User = model<IUSER>("User", userSchema);

//
// export const userJsonForCreate: IUSER = ;
