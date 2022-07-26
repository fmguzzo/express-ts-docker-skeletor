import supertest from "supertest";
import app from "../../app";
import { mongoConnect, mongoDisconnect } from "../../utils/connectMongo";
import { createUser } from "../../services/user.service";
import { createSession } from "../../services/auth.service";
import { signJwt } from "../../utils/jwt";
import AppConfig from "../../config/appConfig";
const config = AppConfig.getInstance().config;

describe("Authorization API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  // Create user
  const USER_PASSWORD = "123456";
  async function createTestUser() {
    const user = {
      email: `${+new Date()}@mail.com`,
      firstName: "Fernando",
      lastName: "Martin",
      password: USER_PASSWORD,
      verified: true,
    };
    return await createUser(user);
  }

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a signed accessToken & refresh token", async () => {
        const testUser = await createTestUser();
        const sessionInput = {
          email: testUser.email,
          password: USER_PASSWORD,
        };
        const response = await supertest(app)
          .post("/api/v1/sessions")
          .send(sessionInput)
          .expect(200);

        expect(response.body).toEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });

    describe("given the username and password are not valid", () => {
      it("should return 401 | Invalid email or password", async () => {
        const testUser = await createTestUser();
        const sessionInput = {
          email: testUser.email,
          password: "000000",
        };
        const response = await supertest(app)
          .post("/api/v1/sessions")
          .send({ ...sessionInput, password: "not match" })
          .expect(401);
        expect(response.body.message).toBe("Invalid email or password");
      });
    });
  });

  describe("Refresh access token", () => {
    describe("Given valid refresh token session", () => {
      test("should return new access token", async () => {
        const testUser = await createTestUser();
        const sessionPayload = {
          userId: testUser._id,
          userAgent: "test",
        };
        const newSession = await createSession(sessionPayload);
        const refreshToken = signJwt(
          {
            session: newSession._id,
          },
          "refreshTokenPrivateKey",
          {
            expiresIn: config.refreshTokenTtl,
          }
        );

        const { body } = await supertest(app)
          .post("/api/v1/sessions/refresh")
          .set("x-refresh", refreshToken)
          .expect(200);

        expect(body).toEqual({ accessToken: expect.any(String) });
      });
    });

    describe("Given invalid refresh token session", () => {
      test("should return 401 | Could not refresh access token", async () => {
        const { body } = await supertest(app)
          .post("/api/v1/sessions/refresh")
          .set("x-refresh", "INVALID_REFRESH_TOKEN")
          .expect(401);
        expect(body.message).toBe("Could not refresh access token");
      });
    });
  });
});
