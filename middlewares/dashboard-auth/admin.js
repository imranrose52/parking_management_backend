import { CustomErrorHandler, JwtService } from "../../services";
import catchAsyncErrors from "../error-handler/catch-async-errors";
import { Admin_user_model } from "../../models";

// this middleware for to cheack dashboard user is role is admin or not
const admin = () =>
  catchAsyncErrors(async (req, res, next) => {
    const user = await AdminUser.findOne({ _id: req.user._id });
    if (user && user.role === "admin") {
      next();
    } else {
      return next(CustomErrorHandler.unAuthorize());
    }
  });

export default admin;
