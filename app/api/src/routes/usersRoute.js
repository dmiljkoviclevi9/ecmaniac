import { Router } from 'express';

import { requireAdmin, auth } from "../middleware/auth.js";
import { container } from "../../dependencyInjectionConfig.js";


const getUserRouter = () => {

    const userController = container.resolve("userController");
    const usersRouter = Router();


    usersRouter.route('/verify')
        .post(userController.verifyUser)
    
    usersRouter.route('/resend-verification')
        .post(userController.resendVerification)

    // usersRouter.route('/reset-password')
    //     .post(userController.resetPassword)

    usersRouter.route('/')
        .post(userController.createUser)
        .get(auth, userController.getUsers);

    usersRouter.route('/:id')
        .patch(auth, userController.patchUser)
        .put(auth, userController.updateUser)
        .delete(auth, requireAdmin, userController.deleteUser)
        .get(auth, userController.getUser);

    return usersRouter;
};

export default getUserRouter;