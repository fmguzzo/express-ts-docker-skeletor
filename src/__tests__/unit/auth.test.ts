// TODO (a): Do not mock createSession in auth.services.ts
// fail/not complete test. Allways execute SessionModel.create() and
// keep open TCPSERVERWRAP

import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../app";
import * as UserService from "../../services/user.service";
import * as AuthService from "../../services/auth.service";

// TODO (a)
// jest.mock("../services/auth.service", () => {
//   const originalModule = jest.requireActual("../services/auth.service");
//   return {
//     ...originalModule,
//     createSession: jest.fn(() => sessionPayload),
//     //createSession: () => Promise.resolve(sessionPayload),
//   };
// });

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  firstName: "Felipe",
  lastName: "Martin",
  email: "felipe.martin@example.com",
  verified: true,
};

// TODO: es correcto definir asi los metodos de UserModel
const userDocument = {
  ...userPayload,
  toJSON: () => {
    return { ...userPayload };
  },
  comparePassword: () => true,
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2021-09-30T13:31:07.674Z"),
  updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  __v: 0,
};

describe("create user session", () => {
  describe("given the username and password are valid", () => {
    /*
    it("should return a signed accessToken & refresh token", async () => {
      jest
        .spyOn(UserService, "findUserByEmail")
        // @ts-ignore
        .mockReturnValue(userDocument);
      jest
        .spyOn(AuthService, "createSession")
        // @ts-ignore
        .mockReturnValue(sessionPayload);

      const req = {
        get: () => {
          return "a user agent";
        },
        body: {
          email: "felipe.martin@example.com",
          password: "Password123",
        },
      };

      const send = jest.fn();

      const res = {
        send,
      };

      const next = jest.fn();

      // @ts-ignore
      await createSessionHandler(req, res, next);

      expect(send).toHaveBeenCalledWith({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
    */

    it.skip("should return a signed accessToken & refresh token", async () => {
      const userServiceSpy = jest.spyOn(UserService, "findUserByEmail");
      // @ts-ignore
      userServiceSpy.mockReturnValue(userDocument);

      // TODO (a)
      // jest
      //   .spyOn(AuthService, "createSession")
      //   // @ts-ignore
      //   .mockReturnValue(sessionPayload);

      const createSessionSpy = jest.spyOn(AuthService, "createSession");
      createSessionSpy.mockImplementationOnce(() => {
        throw new Error("Invalid access token");
      });

      const { statusCode, body } = await supertest(app)
        .post("/api/v1/sessions")
        .send({
          email: "felipe.martin@example.com",
          password: "Password123",
        });
      expect(statusCode).toBe(200);
    });
  });
});
