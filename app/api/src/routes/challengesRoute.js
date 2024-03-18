import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import { container } from "../dependencyInjectionConfig.js";


const getChallengeRouter = () => {
    const challengeController = container.resolve("challengeController");
    const challengeRouter = Router();

// create challenge
challengeRouter.post('/challenge/create', [
    body("title")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 chars long."),
    body("description")
      .notEmpty()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Description must be less then 30 chars long."),
    body("difficulty")
      .notEmpty()
      .withMessage("Difficulty is required."),
    body("category")
      .notEmpty()
      .withMessage("Category is required."),
    body("creator")
      .notEmpty()
      .withMessage("Creator is required."),
    body("tests")
      .notEmpty()
      .withMessage("Tests are required."),
  ],
  auth,
  challengeController.createChallenge
);

// update challenge
challengeRouter.put('/challenge/:id/update', [
    body("title")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 chars long."),
    body("description")
      .notEmpty()
      .trim()
      .isLength({ max: 30 })
      .withMessage("Description must be less then 30 chars long."),
    body("difficulty")
      .notEmpty()
      .withMessage("Difficulty is required."),
    body("category")
      .notEmpty()
      .withMessage("Category is required."),
    body("creator")
      .notEmpty()
      .withMessage("Creator is required."),
    body("tests")
      .notEmpty()
      .withMessage("Tests are required."),
  ],
  auth,
  challengeController.updateChallenge
);

// delete challenge
challengeRouter.delete('/challenge/:id/delete', auth, requireAdmin, challengeController.deleteChallenge);

// get specific challenge
challengeRouter.get('/challenge/:id/get', auth, challengeController.getChallenge);

// get all challenges
challengeRouter.get('/challenge/getAll', auth, challengeController.getAllChallenges);

return challengeRouter;
};

export default getChallengeRouter;
