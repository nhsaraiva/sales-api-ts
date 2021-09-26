import { Router } from 'express';
import ProductController from '../controllers/OrderController';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/infra/http/middlewares/isAuthenticated';

const orderRouter = Router();

orderRouter.use(isAuthenticated);

const orderController = new ProductController();

orderRouter.get(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    orderController.show,
);

orderRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            customer_id: Joi.string().uuid().required(),
            products: Joi.required(),
        },
    }),
    orderController.create,
);

export default orderRouter;
