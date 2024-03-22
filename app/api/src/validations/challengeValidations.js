import { body } from 'express-validator';

export const challengeValidationFull = [
  body("title")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 chars long."),
  body("description")
      .notEmpty()
      .trim()
      .isLength({ min: 15 })
      .withMessage("Description must be at least 15 chars long."),
  body("difficulty")
      .notEmpty()
      .withMessage("Difficulty is required."),
  body("category")
      .notEmpty()
      .withMessage("Category is required."),
  body("tests")
      .notEmpty()
      .withMessage("Tests are required.")
      .isArray()
      .withMessage("Tests should be an array.")
      .custom((tests) => {
        for (let test of tests) {
            if (!test.input || test.input.length === 0) {
                throw new Error("Each test must have at least one input.");
            }
            // Check if any input is an empty string
            if (test.input.some(i => typeof i === 'string' && i.trim() === "")) {
                throw new Error("String inputs must not be empty.");
            }
            if (typeof test.expectedOutput === 'string' && test.expectedOutput.trim() === "") {
                throw new Error("Expected output as string must not be empty.");
            }
        }
        return true; // Indicate that the custom test passed
    }),
];

export const challengeValidationOptional = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 chars long."),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 15 })
    .withMessage("Description must be at least 15 chars long."),
  // body("difficulty")
  //   .optional()
  //   .withMessage("Difficulty is required."),
  // body("category")
  //   .optional()
  //   .withMessage("Category is required."),
  // // 'creator' won't be modified via PATCH/PUT
  // body("tests")
  //   .optional()
  //   .isArray()
  //   .withMessage("Tests are required and should be an array."),
];