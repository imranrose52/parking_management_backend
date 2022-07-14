import jwt from "jsonwebtoken";

class JwtService {
  static sign(payload, expiry = "1y", secret = process.env.JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }
  static verify(token, secret = process.env.JWT_SECRET) {
    return jwt.verify(token, secret);
  }
  static setToken() {
    return {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  }
  static deleteToken() {
    return {
      expires: new Date(Date.now()),
      httpOnly: true,
    };
  }
}

export default JwtService;
