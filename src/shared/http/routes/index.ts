import customerRouter from '@modules/customers/routes/customers.routes';
import orderRouter from '@modules/orders/routes/orders.routes';
import productRouter from '@modules/products/routes/products.routes';
import passwordRouter from '@modules/users/routes/password.routes';
import userProfileRouter from '@modules/users/routes/profile.routes';
import sessionRouter from '@modules/users/routes/sessions.routes';
import userRouter from '@modules/users/routes/users.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/products', productRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', userProfileRouter);
routes.use('/customers', customerRouter);
routes.use('/orders', orderRouter);

export default routes;
