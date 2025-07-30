import { IUSER, Status } from "../modules/user/user.interface";

export interface UserValidationResult {
  isValid: boolean;
  message?: string;
  statusCode?: number;
}

export const validateUserStatus = (
  user: IUSER | null
): UserValidationResult => {
  if (!user) {
    return {
      isValid: false,
      message: "User does not exist",
      statusCode: 400,
    };
  }

  if (user.status === Status.BLOCKED) {
    return {
      isValid: false,
      message: "Your account is blocked",
      statusCode: 400,
    };
  }
  if (user.status === Status.SUSPENDED) {
    return {
      isValid: false,
      message: "Your account is suspended",
      statusCode: 400,
    };
  }

  if (user.isDeleted) {
    return {
      isValid: false,
      message: "User is deleted",
      statusCode: 400,
    };
  }

  if (!user.isEmailVerified) {
    return {
      isValid: false,
      message: "User email is not verified",
      statusCode: 400,
    };
  }

  if (!user.isPhoneVerified) {
    return {
      isValid: false,
      message: "User phone is not verified",
      statusCode: 400,
    };
  }

  return {
    isValid: true,
  };
};
