import { signJwt } from "../utils/jwt";
import AppConfig from "../config/appConfig";
import { prisma } from "../utils/prismaClient";
import { Prisma } from "@prisma/client";
const config = AppConfig.getInstance().config;

/*
export async function createSession(user: string, isAdmin: boolean) {
  const session = await SessionModel.create({ user, isAdmin });
  return session.toJSON();
}
*/

export async function createSession({
  userId,
  userAgent,
}: Prisma.SessionCreateManyInput) {
  return prisma.session.create({
    data: {
      userId,
      userAgent,
    },
  });
}

export async function findSessionById(sessionId: string) {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
    },
  });
}

export async function findSessions(query: Prisma.SessionWhereInput) {
  return prisma.session.findFirst({
    where: {
      ...query,
    },
  });
}

export async function updateSession(
  query: Prisma.SessionWhereInput,
  data: Prisma.SessionUpdateInput
) {
  return prisma.session.updateMany({
    where: {
      ...query,
    },
    data: {
      ...data,
    },
  });
}

export async function signRefreshToken({
  userId,
  userAgent,
}: Prisma.SessionCreateManyInput) {
  const session = await createSession({
    userId,
    userAgent,
  });

  const refreshToken = signJwt(
    {
      session: session.id,
    },
    "refreshTokenPrivateKey",
    {
      expiresIn: config.refreshTokenTtl,
    }
  );

  return refreshToken;
}

export function signAccessToken(user: Partial<Prisma.UserCreateInput>) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: config.accessTokenTtl,
  });

  return accessToken;
}
