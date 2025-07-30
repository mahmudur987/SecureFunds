import { IsActive, IUSER } from "../modules/user/user.interface";

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

  if (
    user.isActive === IsActive.BLOCKED ||
    user.isActive === IsActive.INACTIVE
  ) {
    return {
      isValid: false,
      message: "User is blocked or inactive",
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

  if (!user.isVerified) {
    return {
      isValid: false,
      message: "User is not verified",
      statusCode: 400,
    };
  }

  return { isValid: true };
};
