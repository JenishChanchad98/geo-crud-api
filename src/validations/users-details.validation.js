const { object, string, number, date } = require("zod");

const updateUserDetailsValidation = object({
  body: object({
    gender: string()
      .refine((val) => ["male", "female", "other"].includes(val), {
        message: "Gender must be 'male', 'female', or 'other'",
      })
      .optional(),
    about: string()
      .max(500, { message: "About must not exceed 500 characters" })
      .optional(),
    birth_date: string().optional(),
    job: string()
      .max(100, { message: "Job must not exceed 100 characters" })
      .optional(),
    height: string().optional(),
    age: number()
      .min(0, { message: "Age must be a positive number" })
      .max(120, { message: "Age must be less than or equal to 120" })
      .optional(),
    weight: string().optional(),
    longitude: number().optional(),
    latitude: number().optional(),
    location: string()
      .max(200, { message: "Location must not exceed 200 characters" })
      .optional(),
  }).strict(),
});

const usersListValidation = object({
  body: object({
    page: number()
      .min(1, { message: "Page number must be greater than or equal to 1" })
      .optional(),
    numberOfRecord: number()
      .min(1, {
        message: "Number of records must be greater than or equal to 1",
      })
      .max(500, { message: "Number of records must not exceed 500" })
      .optional(),
    longitude: number(),
    latitude: number(),
  }).strict(),
});

module.exports = { updateUserDetailsValidation, usersListValidation };
