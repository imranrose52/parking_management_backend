import { CustomErrorHandler, JwtService } from "../../../services";
import Joi from "joi";
import { Refresh_token_model, Admin_user_model } from "../../../models";
import bcrypt from "bcrypt";

const loginController = {
  async login(req, res, next) {
    // validating request data using joi library--------------------------------
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    // throw validation error--------------------------------------------------------
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // cheack user exist or not -----------------------------------------------
    const user = await Admin_user_model.findOne({
      email: req.body.email,
    });
    // throw custom error if email not exist------------------------------------------------
    if (!user) {
      return next(CustomErrorHandler.wrongCredentials("User not found!"));
    }

    // compare  pasword ----------------------------------------------------
    const access = await bcrypt.compare(req.body.password, user.password);

    if (!access) {
      return next(
        CustomErrorHandler.wrongCredentials("Password does not match")
      );
    }

    // jwt token ----------------------------------------------------------------

    const accesToken = JwtService.sign(
      { _id: user._id, role: user.role },
      "1y"
    );

    // sing refresh token for 1 year validity-------------------------------------

    const refreshToken = JwtService.sign(
      { _id: user._id, role: user.role },
      "1y",
      process.env.JWT_REFRESH_TOKEN
    );

    // whitelist refresh token in database------------------------------------------

    await Refresh_token_model.create({ token: refreshToken });
    res
      .status(201)
      .cookie("access_token", accesToken, JwtService.setToken())
      .cookie("refresh_token", refreshToken, JwtService.setToken())
      .json({ success: true, accesToken, refreshToken, user });
  },

  async logout(req, res, next) {
    // // validating request data using joi library--------------------------------
    // const refreshTokenSchema = Joi.object({
    //   refresh_token: Joi.string().required(),
    // });

    // // throw validation error--------------------------------------------------------
    // const { error } = refreshTokenSchema.validate(req.body);
    // if (error) {
    //   return next(error);
    // }

    const { refresh_token } = req.cookies;

    console.log(refresh_token);

    if (!refresh_token) {
      return next(CustomErrorHandler.unAuthorize());
    }

    let respone = await Refresh_token_model.deleteOne({
      token: refresh_token,
    });

    if (respone.deletedCount === 0) {
      return next(CustomErrorHandler.sometingWorng());
    }

    res
      .status(201)
      .cookie("access_token", null, JwtService.deleteToken())
      .cookie("refresh_token", null, JwtService.deleteToken())
      .json({ success: true, data: "deleted" });
  },
};

export default loginController;
