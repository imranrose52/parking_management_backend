import { CustomErrorHandler, JwtService } from "../../../services";
import Joi from "joi";
import { Refresh_token_model, Admin_user_model } from "../../../models";
import bcrypt from "bcrypt";

const refreshController = {
  async refresh(req, res, next) {
    // validating request data using joi library--------------------------------
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    // throw validation error--------------------------------------------------------
    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // cheack refresh token exist or not in database -----------------------------------------------
    let rToken = await Refresh_token_model.findOne({
      token: req.body.refresh_token,
    });
    // throw custom error if email not exist------------------------------------------------
    if (!rToken) {
      return next(CustomErrorHandler.unAuthorize("Invalid refresh token!"));
    }

    // refresh  token verify  ----------------------------------------------------------------

    const { _id } = JwtService.verify(
      rToken.token,
      process.env.JWT_REFRESH_TOKEN
    );

    // check user in database ------------------------------------------------------------------
    let user = await Admin_user_model.findOne({ _id });

    if (!user) {
      return next(CustomErrorHandler.unAuthorize("User not found!"));
    }

    //  GENARATE NEW TOKEN -----------------------------------------------------

    const acces_token = JwtService.sign({ _id: user._id, role: user.role });

    // sing refresh token for 1 year validity-------------------------------------

    const refresh_token = JwtService.sign(
      { _id: user._id, role: user.role },
      "1y",
      process.env.JWT_REFRESH_TOKEN
    );

    // whitelist refresh token in database------------------------------------------

    await Refresh_token_model.create({ token: refresh_token });

    res
      .status(201)
      .json({ success: true, data: { acces_token, refresh_token } });
  },
};

export default refreshController;
