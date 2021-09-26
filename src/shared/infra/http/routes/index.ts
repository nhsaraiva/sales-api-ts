import customerRouter from '@modules/customers/infra/http/routes/customers.routes';
import orderRouter from '@modules/orders/infra/http/routes/orders.routes';
import productRouter from '@modules/products/infra/http/routes/products.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import userProfileRouter from '@modules/users/infra/http/routes/profile.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
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
