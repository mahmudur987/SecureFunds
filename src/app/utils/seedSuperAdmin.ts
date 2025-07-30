/* eslint-disable no-console */
import { envVariables } from "../config/env.config";
import { IUSER, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  const isSuperAdminExist = await User.findOne({
    email: envVariables.SUPER_ADMIN_EMAIL,
  });

  if (isSuperAdminExist) {
    console.log("SuperAdmin Exist");
    return;
  }
  try {
    const SuperAdmin: Partial<IUSER> = {
      name: "super Admin",
      email: envVariables.SUPER_ADMIN_EMAIL,
      password: envVariables.SUPER_ADMIN_PASSWORD,
      isVerified: true,
      role: Role.SUPER_ADMIN,
      auths: [
        { provider: "credential", providerId: envVariables.SUPER_ADMIN_EMAIL },
      ],
    };

    await User.create(SuperAdmin);
    console.log("super admin created");
  } catch (error) {
    console.error(error);
  }
};
