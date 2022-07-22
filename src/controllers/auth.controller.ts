import { Request, Response, NextFunction } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import {
  signAccessToken,
  signRefreshToken,
  findSessionById,
  findSessions,
  updateSession,
} from "../services/auth.service";
import {
  findUserByEmail,
  findUserById,
  validatePassword,
} from "../services/user.service";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt";

// Represent login - Create new session when is called
// Dont't check if active session already exist
// Create new session active and left the oders active too
export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Invalid email or password";

  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(401);
      throw new Error(message);
    }

    if (!user.verified) {
      res.status(403);
      throw new Error("Please verify your email");
    }

    const isValid = await validatePassword(user._id, password);
    if (!isValid) {
      res.status(401);
      throw new Error(message);
    }

    // sign a access token
    const accessToken = signAccessToken(user);

    // sign a refresh token
    const refreshToken = await signRefreshToken({
      userId: user._id,
      userAgent: req.get("user-agent") || "",
    });

    // send the tokens

    return res.send({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = get(req, "headers.x-refresh");

    const { decoded } = verifyJwt<{ session: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );

    if (!decoded) {
      res.status(401);
      throw new Error("Could not refresh access token");
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
      res.status(401);
      throw new Error("Could not refresh access token");
    }

    const user = await findUserById(String(session.user));

    if (!user) {
      res.status(401);
      throw new Error("Could not refresh access token");
    }

    const accessToken = signAccessToken(user);

    return res.send({ accessToken });
  } catch (error) {
    next(error);
  }
}

export async function getUserSessionsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = res.locals.user._id;
    const sessions = await findSessions({ user: userId, valid: true });
    if (!sessions) {
      res.status(403);
      throw new Error("Does not exist active session for User");
    }
    return res.send(sessions);
  } catch (error) {
    next(error);
  }
}

/**********************************************************
// Representa un logout. No esta implementado 100%. 
// A modo de ejemplo se busca la primera session activa
// Con la actual implementacion solo podemos obtener la
// session activa del refreshtoken. Habria que estudiar
// cual es la mejor implementacion segun las necesidades
// https://github.com/TomDoesTech/REST-API-Tutorial-Updated
// En el repo de arriba, podria ser una opcion:
// - Se almacena la session en el access token
// - deserializeUser.ts almacena ademas de user, la session 
*********************************************************** */
export async function deleteSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: el desarialize, manejo del refresh
  try {
    const userId = res.locals.user._id;
    const sessions = await findSessions({ user: userId, valid: true });
    if (!sessions) {
      res.status(403);
      throw new Error("Does not exist active session for User");
    }
    await updateSession({ _id: sessions?._id }, { valid: false });

    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  } catch (error) {
    next(error);
  }
}
