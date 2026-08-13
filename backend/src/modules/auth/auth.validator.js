    import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .isIn(["admin", "vendor", "buyer"])
    .withMessage("Role must be admin, vendor or buyer"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty() 
    .withMessage("Password is required"),
];

export const addressValidator = [
  body("fullName").trim().notEmpty().withMessage("Recipient name is required"),
  body("phone").trim().matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10-digit mobile number"),
  body("addressLine1").trim().notEmpty().withMessage("Address line is required"),
  body("district").trim().notEmpty().withMessage("City or district is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("pincode").trim().matches(/^\d{6}$/).withMessage("Enter a valid 6-digit PIN code"),
];
