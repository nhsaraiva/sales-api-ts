import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/uploadConfig';
import UserController from '../controllers/UserController';
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const userRouter = Router();

const userController = new UserController();

const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

userRouter.get('/', isAuthenticated, userController.index);
userRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    userController.create,
);
userRouter.patch(
    '/avatar',
    isAuthenticated,
    upload.single('avatar'),
    userAvatarController.update,
);

export default userRouter;
