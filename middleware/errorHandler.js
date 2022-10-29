const { CustomAPIError } = require("../errors/customErrors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  //   return res.status(500).json({ msg: err }); or own message
  return res
    .status(500)
    .json({ msg: "Something went wrong, with routes controllers!" });
};

module.exports = errorHandlerMiddleware;
