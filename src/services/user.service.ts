import { FilterQuery, UpdateQuery } from "mongoose";
import UserModel, { UserField, UserDocument } from "../models/user.model";

export async function createUser(user: Partial<UserField>) {
  const userCreated = await UserModel.create(user);
  return userCreated.toJSON();
}

export async function findUserById(id: string) {
  return UserModel.findById(id);
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

// General findUser()
export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function saveUser(id: string, update: UpdateQuery<UserField>) {
  const userUpdated = await UserModel.findByIdAndUpdate(id, update, {
    new: true,
  });
  return userUpdated?.toJSON();
}

export async function validatePassword(userId: string, password: string) {
  const user = await UserModel.findById(userId);
  return user?.comparePassword(password);
}
