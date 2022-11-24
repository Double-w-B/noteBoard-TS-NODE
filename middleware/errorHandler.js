const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.name === "CastError") {
    customError.msg = `No item found with id ${err.value}`;
    customError.statusCode = 404;
  }

  if (err.name === "ValidationError") {
    customError.msg = `Please, provide ${Object.values(err.errors)
      .map((item) => item.message)
      .join(", ")}.`;

    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue).toString();
    customError.msg = `This ${field} exists already, please choose another one.`;
    customError.statusCode = 400;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
