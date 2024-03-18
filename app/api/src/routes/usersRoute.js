import { Router } from 'express';

import { auth } from "../middleware/auth.js";
import { container } from "../../dependencyInjectionConfig.js";


const getUserRouter = () => {

    const userController = container.resolve("userController");
    const usersRouter = Router();


    usersRouter.route('/verify')
        .get(userController.verifyUser)

    usersRouter.route('/')
        .post(userController.createUser)
        .get(auth, userController.getUsers);

    usersRouter.route('/:id')
        .patch(auth, userController.patchUser)
        .put(auth, userController.updateUser)
        .delete(auth, userController.deleteUser)
        .get(auth, userController.getUser);

    return usersRouter;
};

export default getUserRouter;