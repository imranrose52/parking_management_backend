import { CustomErrorHandler, JwtService } from "../../services";
import catchAsyncErrors from "../error-handler/catch-async-errors";

// this middleware for to cheack and verify access_token from req.cookie and add user object in every request

const auth = catchAsyncErrors(async (req, res, next) => {
  // let authHeader = req.headers.authorization;
  // let authHeader = req.cookies;
  const { access_token } = req.cookies;
  // console.log(access_token);
  if (!access_token) {
    return next(CustomErrorHandler.unAuthorize());
  }

  // const token = authHeader.split(" ")[1];
  // console.log(access_token);

  const { _id, role } = await JwtService.verify(access_token);
  if (!_id && role) {
    return next(CustomErrorHandler.unAuthorize());
  }

  const user = { _id, role };
  req.user = user;
  next();
});

export default auth;
