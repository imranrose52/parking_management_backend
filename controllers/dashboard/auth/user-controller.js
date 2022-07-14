import { CustomErrorHandler, JwtService } from "../../../services";
import Joi from "joi";
import { Admin_user_model } from "../../../models";
import bcrypt from "bcrypt";

const userController = {
  async self(req, res, next) {
    // cheack user exist or not -----------------------------------------------
    const user = await Admin_user_model.findOne({ _id: req.user._id }).select(
      "-password -updatedAt -__v"
    );

    if (!user) {
      return next(CustomErrorHandler.notFound());
    }
    console.log("hello");

    res.status(201).json({ success: true, data: user });
  },
};

export default userController;
