/* eslint-disable no-console */
import { envVariables } from "../config/env.config";
import { IUSER, Role, Status } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../modules/wallet/wallet.model";
export const seedAdmin = async () => {
  const isAdminExist = await User.findOne({
    email: envVariables.SUPER_ADMIN_EMAIL,
  });

  if (isAdminExist) {
    console.log("Admin Exist");
    return;
  }

  const hashPass = await bcrypt.hash(envVariables.SUPER_ADMIN_PASSWORD, 10);

  try {
    const Admin: Partial<IUSER> = {
      name: " Admin",
      email: envVariables.SUPER_ADMIN_EMAIL,
      password: hashPass,
      isEmailVerified: true,
      isPhoneVerified: true,
      phone: "01671706882",
      status: Status.ACTIVE,
      role: Role.ADMIN,
      auths: [
        { provider: "credential", providerId: envVariables.SUPER_ADMIN_EMAIL },
      ],
    };

    const admin = await User.create(Admin);
    const walletData = {
      userId: admin._id,
      balance: 500000000000,
      isBlocked: false,
    };
    const wallet = await Wallet.create(walletData);

    admin.wallet = wallet._id;
    await admin.save();

    console.log(" admin created");
  } catch (error) {
    console.error(error);
  }
};
