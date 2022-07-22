import mongoose from "mongoose";
import supertest from "supertest";
import app from "../../app";
import * as UserService from "../../services/user.service";

const userInput = {
  firstName: "Felipe",
  lastName: "Martin",
  email: "felipe.martin@example.com",
  password: "Password123",
  passwordConfirmation: "Password123",
};

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

describe("user", () => {
  describe("user registration", () => {
    describe("given the username and password are valid", () => {
      it("should return a 200 and user payload", async () => {
        // @ts-ignore
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userDocument);
        const { statusCode, body } = await supertest(app)
          .post("/api/v1/users")
          .send(userInput);

        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe("given the passwords do not match", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest.spyOn(UserService, "createUser");
        const { statusCode, body } = await supertest(app)
          .post("/api/v1/users")
          .send({ ...userInput, passwordConfirmation: "NotMatch" });
        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
        expect(body.message).toBe("Passwords do not match");
      });
    });

    describe("given the user service throws", () => {
      it("should return a 409 error", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          .mockRejectedValueOnce("Throw ERROR");

        const { statusCode } = await supertest(app)
          .post("/api/v1/users")
          .send(userInput);

        expect(statusCode).toBe(500);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });
});
