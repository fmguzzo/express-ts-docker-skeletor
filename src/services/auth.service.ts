import { omit } from "lodash";
import { signJwt } from "../utils/jwt";
import { FilterQuery, UpdateQuery } from "mongoose";
import { privateFields, UserDocument } from "../models/user.model";
import SessionModel, { SessionDocument } from "../models/session.model";
import AppConfig from "../config/appConfig";
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
}: {
  userId: string;
  userAgent: string;
}) {
  return SessionModel.create({ user: userId, userAgent });
}

export async function findSessionById(sessionId: string) {
  return SessionModel.findById(sessionId);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.findOne(query);
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function signRefreshToken({
  userId,
  userAgent,
}: {
  userId: string;
  userAgent: string;
}) {
  const session = await createSession({
    userId,
    userAgent,
  });

  const refreshToken = signJwt(
    {
      session: session._id,
    },
    "refreshTokenPrivateKey",
    {
      expiresIn: config.refreshTokenTtl,
    }
  );

  return refreshToken;
}

export function signAccessToken(user: UserDocument) {
  //const payload = omit(user.toJSON(), privateFields);
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const accessToken = signJwt(payload, "accessTokenPrivateKey", {
    expiresIn: config.accessTokenTtl,
  });

  return accessToken;
}
