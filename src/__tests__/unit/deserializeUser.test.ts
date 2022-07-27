import deserializeUser from "../../middlewares/deserializeUser";
import httpMocks from "node-mocks-http";
import * as middleware from "../../utils/jwt";

// testing with spyOn()
describe("DeserializeUser Middleware", () => {
  describe("Given valid access token", () => {
    test("Should return user data in req", async () => {
      const next = jest.fn();
      const accessToken = "123-456-789";
      const decoded = { _id: "userId" };
      jest.spyOn(middleware, "verifyJwt").mockReturnValue({
        valid: true,
        expired: false,
        decoded,
      });
      const req = httpMocks.createRequest({
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const res = httpMocks.createResponse();

      await deserializeUser(req, res, next);

      expect(next).toBeCalled();
      expect(res.locals.user).toEqual(decoded);
    });
  });
  describe("Given invalid access token", () => {
    test("Should not return user data in req", async () => {
      //const next = jest.fn() as NextFunction;
      const next = jest.fn();
      const req = httpMocks.createRequest({
        method: "GET",
        headers: {
          authentication: "",
        },
      });
      const res = httpMocks.createResponse();
      await deserializeUser(req, res, next);
      expect(next).toBeCalled();
      expect(res.locals.user).toBeUndefined();
    });
  });
});
