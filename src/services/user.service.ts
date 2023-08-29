import { prisma } from "../utils/prismaClient";
import { Prisma } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/password";

const userSafeSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
};

const userRegularSelect = {
  ...userSafeSelect,
  verified: true,
  verificationCode: true,
  passwordResetCode: true,
};

// General findUser()
// export async function findUser(query: FilterQuery<UserDocument>) {
//   return UserModel.findOne(query).lean();
// }

/** ######################################################### */
/** ########## Migrate mongodb to prisma postgresql ######### */
/** ######################################################### */

export async function validatePassword(
  userId: string,
  passwordToValidate: string
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });
  if (!user) return false;

  return comparePassword(user.password, passwordToValidate);
}

export async function createUser(user: Prisma.UserCreateInput) {
  // TODO: Make hash by prisma midleware
  const passwordHashed = await hashPassword(user.password);
  const userCreated = await prisma.user.create({
    data: { ...user, password: passwordHashed },
  });
  console.log(userCreated);
  return userCreated;
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      ...userRegularSelect,
    },
  });
}

export async function saveUser(id: string, data: Prisma.UserUpdateInput) {
  // TODO: Make hash by prisma midleware
  if (data.password && typeof data.password === "string") {
    data.password = await hashPassword(data.password);
  }
  const userUpdated = await prisma.user.update({
    where: { id },
    data: { ...data },
  });
  return userUpdated;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: { ...userRegularSelect },
  });
}
