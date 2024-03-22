import { Router } from 'express';
import { validationResult } from 'express-validator';
import { requireAdmin, auth } from '../middleware/auth.js';
import { container } from "../../dependencyInjectionConfig.js";
import * as validate from "../validations/challengeValidations.js";


const getChallengeRouter = () => {

  const challengeController = container.resolve("challengeController");
  const challengeRouter = Router();

  // create challenge
  challengeRouter.route('/')
    .post([...validate.challengeValidationFull], auth, (req, res, next) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Proceed with creating the challenge if no errors
      challengeController.createChallenge(req, res, next);
    })
    .get(auth, challengeController.getChallenges)

  challengeRouter.route('/:id')
    .patch([...validate.challengeValidationOptional], auth, challengeController.updateChallenge)
    .put([...validate.challengeValidationOptional], auth, challengeController.updateChallenge)
    .delete(auth, requireAdmin, challengeController.deleteChallenge)
    .get(auth, challengeController.getChallenge);

  return challengeRouter;
};

export default getChallengeRouter;