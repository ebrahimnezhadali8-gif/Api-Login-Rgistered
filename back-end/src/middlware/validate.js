import AppError from "../utilites/app_error.js";

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, 
  });

  if (error) {
    throw new AppError(
      "ERROR_VALIDATION",
      error.details.map((e) => e.message).join(" | "),
      400
    );
  }

  req.body = value;
  next();
};
