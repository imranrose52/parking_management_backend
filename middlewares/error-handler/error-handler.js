import { CustomErrorHandler } from "../../services";
import multer from "multer";

// this error handler handle/catch all possible types of errors and send error status code and error message in response

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal server error",
    ...(process.env.DEBUG_MODE === "true" && { originalMessage: err.message }),
  };

  // if (err instanceof ValidationError) {
  //   statusCode = 422;
  //   data = {
  //     message: err.message,
  //   };
  // }
  if (err instanceof multer.MulterError) {
    statusCode = 422;
    data = {
      message: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.statusCode;
    data = {
      message: err.message,
    };
  }

  // Handle Wrong MongoDB id error ---------------------------------------------------------------

  if (err.name === "CastError") {
    statusCode = 409;
    data = {
      message: "id not found",
    };
  }

  //   if env PRODUCTION=true then don't show stack-----------------------
  return res.status(statusCode).json(data);
};

export default errorHandler;
