import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '../../../../../shared/infra/http/middlewares/isAuthenticated';
import ProfileController from '../controllers/ProfileController';

const userProfileRouter = Router();

const profileController = new ProfileController();

userProfileRouter.use(isAuthenticated);

userProfileRouter.get('/', profileController.show);
userProfileRouter.put(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string(),
            password: Joi.string().optional(),
            password_confirmation: Joi.string()
                .valid(Joi.ref('password'))
                .when('password', {
                    is: Joi.exist(),
                    then: Joi.required(),
                }),
        },
    }),
    profileController.update,
);

export default userProfileRouter;
