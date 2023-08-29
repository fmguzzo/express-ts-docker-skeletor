import { FilterQuery, UpdateQuery } from "mongoose";
import UserModel, { UserField, UserDocument } from "../models/user.model";
import { prisma } from "../utils/prismaClient";
import { Prisma } from "@prisma/client";
import { hashPassword } from "../utils/password";

// export async function createUser(user: Partial<UserField>) {
//   const userCreated = await UserModel.create(user);
//   return userCreated.toJSON();
// }

// export async function findUserById(id: string) {
//   return UserModel.findById(id);
// }

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

// General findUser()
export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

// export async function saveUser(id: string, update: UpdateQuery<UserField>) {
//   const userUpdated = await UserModel.findByIdAndUpdate(id, update, {
//     new: true,
//   });
//   return userUpdated?.toJSON();
// }

export async function validatePassword(userId: string, password: string) {
  const user = await UserModel.findById(userId);
  return user?.comparePassword(password);
}

/** Migrate mongodb to prisma postgresql */
export async function createUser(user: Prisma.UserCreateInput) {
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
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      verified: true,
      verificationCode: true,
    },
  });
}

export async function saveUser(id: string, data: Prisma.UserUpdateInput) {
  const userUpdated = await prisma.user.update({
    where: { id },
    data: { ...data },
  });
  return userUpdated;
}
