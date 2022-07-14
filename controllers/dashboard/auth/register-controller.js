import { CustomErrorHandler, JwtService } from "../../../services";
import Joi from "joi";
import { Admin_user_model, Refresh_token_model } from "../../../models";
import bcrypt from "bcrypt";

const registerController = {
  async register(req, res, next) {
    // validating request data using joi library--------------------------------
    const registerControllerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });

    // throw validation error--------------------------------------------------------
    const { error } = registerControllerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    // cheack if user email already -----------------------------------------------
    const exist = await Admin_user_model.exists({ email: req.body.email });
    // throw custom error if email exist------------------------------------------------
    if (exist) {
      return next(CustomErrorHandler.alreadyExist("Email is taken"));
    }

    // hash password ----------------------------------------------------
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      Number(process.env.PASSWORD_HASH_POWER)
    );

    //  store user into database-----------------------------------------

    const { name, email } = req.body;
    const result = await Admin_user_model.create({
      name,
      email,
      password: hashedPassword,
    });

    // jwt token ----------------------------------------------------------------

    const accesToken = JwtService.sign({ _id: result._id, role: result.role });

    // sing refresh token for 1 year validity-------------------------------------

    const refreshToken = JwtService.sign(
      { _id: result._id, role: result.role },
      "1y",
      process.env.JWT_REFRESH_TOKEN
    );

    // whitelist refresh token in database------------------------------------------

    await Refresh_token_model.create({ token: refreshToken });

    res.status(201).json({ success: true, data: { accesToken, refreshToken } });
  },
};

export default registerController;
