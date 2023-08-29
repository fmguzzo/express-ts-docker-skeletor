import bcrypt from "bcrypt";
import AppConfig from "../config/appConfig";

const config = AppConfig.getInstance().config;

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(config.saltWorkFactor);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

export const comparePassword = async (
  userPassword: string,
  candidatePassword: string
) => {
  return bcrypt.compare(candidatePassword, userPassword).catch(() => false);
};
