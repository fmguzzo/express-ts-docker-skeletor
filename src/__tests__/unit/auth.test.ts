// TODO (a): Do not mock createSession in auth.services.ts
// fail/not complete test. Allways execute SessionModel.create() and
// keep open TCPSERVERWRAP

import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../app";
import * as UserService from "../../services/user.service";
import * as AuthService from "../../services/auth.service";

// TODO (a)
// jest.mock("../../services/auth.service", () => {
//   const originalModule = jest.requireActual("../../services/auth.service");
//   return {
//     __esModule: true,
//     ...originalModule,
//     createSession: jest.fn(() => sessionPayload),
//     //createSession: () => Promise.resolve(sessionPayload),
//   };
// });

const sessionInput = { email: "felipe.martin@example.com", password: "123456" };

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  firstName: "Felipe",
  lastName: "Martin",
  email: sessionInput.email,
  verified: true,
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  // createdAt: new Date("2021-09-30T13:31:07.674Z"),
  // updatedAt: new Date("2021-09-30T13:31:07.674Z"),
  // __v: 0,
};

describe.skip("create user session", () => {
  describe("given the username and password are valid", () => {
    it("should return a signed accessToken & refresh token", async () => {
      // @ts-ignore
      jest.spyOn(UserService, "findUserByEmail").mockReturnValue(userPayload);

      // @ts-ignore
      jest.spyOn(UserService, "validatePassword").mockReturnValue(true);

      jest
        .spyOn(AuthService, "createSession")
        // @ts-ignore
        .mockReturnValue(sessionPayload);

      // console.log(
      //   "MOCK",
      //   createSession({ userId: "a", userAgent: "b" })
      // );

      const response = await supertest(app)
        .post("/api/v1/sessions")
        .send(sessionInput)
        .expect(200);

      expect(response.body).not.toBeNull();
    });
  });
});
