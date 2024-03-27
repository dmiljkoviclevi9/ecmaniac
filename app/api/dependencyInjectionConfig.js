import awilix from "awilix";

import UserController from "./src/controllers/userController.js";
import UserService from "./src/services/userService.js";
import UserRepository from "./src/repositories/userRepository.js";
import ChallengeController from "./src/controllers/challengeController.js";
import ChallengeService from "./src/services/challengeService.js";
import ChallengeRepository from "./src/repositories/challengeRepository.js";
import AuthController from "./src/controllers/authController.js";
import EmailService from "./src/email/emailService.js";

export const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
});

export const setup = () => {
  container.register({
    userController: awilix.asClass(UserController),
    userService: awilix.asClass(UserService),
    userRepository: awilix.asClass(UserRepository),
    challengeController: awilix.asClass(ChallengeController),
    challengeService: awilix.asClass(ChallengeService),
    challengeRepository: awilix.asClass(ChallengeRepository),
    authController: awilix.asClass(AuthController),
    emailService: awilix.asClass(EmailService),
  });
};