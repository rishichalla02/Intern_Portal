import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0]?.msg || "Validation failed",
      errors: errors.array(),
    });
  }
  next();
}

export const validateMongoId = (paramName = "id") => [
  param(paramName)
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage(`Invalid ${paramName} format`),
  validate,
];

export const updateInternValidator = [
  param("id")
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid intern ID format"),
  body("status")
    .optional()
    .isIn(["upcoming", "ongoing", "completed", "cancelled"])
    .withMessage(
      "Invalid status value. Must be upcoming, ongoing, completed, or cancelled",
    ),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date string"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date string")
    .custom((val, { req }) => {
      if (req.body.startDate && val) {
        if (new Date(req.body.startDate) > new Date(val)) {
          throw new Error("Start date cannot be after end date");
        }
      }
      return true;
    }),
  validate,
];

export const assignTeamLeaderValidator = [
  param("id")
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid intern ID format"),
  body("teamLeaderId")
    .notEmpty()
    .withMessage("teamLeaderId is required")
    .custom((val) => mongoose.Types.ObjectId.isValid(val))
    .withMessage("Invalid teamLeaderId format"),
  validate,
];

// my changes
export const setPasswordValidator = (req, res, next) => {
  const { currentSecret, newPassword } = req.body || {};
  const errors = [];

  if (typeof currentSecret !== "string" || !currentSecret) {
    errors.push({
      field: "currentSecret",
      message: "Current intern code or password is required",
    });
  }

  if (typeof newPassword !== "string" || !newPassword) {
    errors.push({ field: "newPassword", message: "New password is required" });
  } else if (newPassword.length < 8) {
    errors.push({
      field: "newPassword",
      message: "Password must be at least 8 characters",
    });
  } else if (!/[A-Za-z]/.test(newPassword)) {
    errors.push({
      field: "newPassword",
      message: "Password must contain at least one letter",
    });
  } else if (!/\d/.test(newPassword)) {
    errors.push({
      field: "newPassword",
      message: "Password must contain at least one number",
    });
  }

  if (errors.length)
    return res.status(400).json({ message: errors[0].message, errors });
  return next();
};

export const updateProfileValidator = (req, res, next) => {
  const mobileNo =
    typeof req.body?.mobileNo === "string" ? req.body.mobileNo.trim() : "";

  if (!/^\d{10}$/.test(mobileNo)) {
    const message = "Mobile number must be exactly 10 digits";
    return res
      .status(400)
      .json({ message, errors: [{ field: "mobileNo", message }] });
  }

  req.body.mobileNo = mobileNo;
  return next();
};
