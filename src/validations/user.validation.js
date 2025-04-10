const { object, string, boolean, date } = require("zod");

const registerValidation = object({
  body: object({
    email: string()
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase(),
    username: string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must not exceed 20 characters" })
      .trim()
      .transform((val) => val.toLowerCase()),
    password: string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
        message:
          "Password must contain at least one letter, one digit, and one special character",
      }),
    phone_number: string()
      .trim()
      .min(10, { message: "Phone number must be at least 10 characters long" })
      .max(15, { message: "Phone number must not exceed 15 characters" }),

    is_verify: boolean().optional(),
    is_online: boolean().optional(),
    last_visit_date: date().optional(),
    user_status: boolean()
      .default(false)
      .refine((val) => [true, false].includes(val), {
        message: "User status must be either true (active) or false (inactive)",
      }),
  }).strict(),
});

const loginValidation = object({
  body: object({
    username: string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must not exceed 20 characters" })
      .trim()
      .transform((val) => val.toLowerCase()),
    password: string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(100, { message: "Password must not exceed 100 characters" })
      .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, {
        message:
          "Password must contain at least one letter, one digit, and one special character",
      }),
  }).strict(),
});

module.exports = {
  registerValidation,
  loginValidation,
};
