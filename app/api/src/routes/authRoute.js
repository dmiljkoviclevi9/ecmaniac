import { Router } from "express";

import { container } from "../../dependencyInjectionConfig.js";

const getAuthRouter = () => {
  const authController = container.resolve("authController");
  const authRouter = Router();

  authRouter.post("/login", authController.logIn);
  authRouter.post("/logout", authController.logOut);

  return authRouter;
};
export default getAuthRouter;