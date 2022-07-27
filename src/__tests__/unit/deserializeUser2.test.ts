jest.mock("../../utils/jwt");
import deserializeUser from "../../middlewares/deserializeUser";
import httpMocks from "node-mocks-http";
import { verifyJwt } from "../../utils/jwt";

// testing with mock()
describe("DeserializeUser Middleware 2", () => {
  describe("Given valid access token", () => {
    test("Should return user data in req", async () => {
      const next = jest.fn();
      const accessToken = "123-456-789";
      const decoded = { _id: "userId" };
      const mockVerifyJwt = verifyJwt as jest.MockedFunction<typeof verifyJwt>;
      mockVerifyJwt.mockReturnValue({
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
});
