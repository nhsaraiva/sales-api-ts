import CustomerRepository from '@modules/customers/infra/typeorm/repositories/CustomerRepository';
import { ProductRepository } from '@modules/products/infra/typeorm/repositories/ProductRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../infra/typeorm/entities/Order';
import { OrderRepository } from '../infra/typeorm/repositories/OrderRepository';

interface IProduct {
    id: string;
    quantity: number;
}

interface IRequest {
    customer_id: string;
    products: IProduct[];
}

class CreateOrderService {
    public async execute({ customer_id, products }: IRequest): Promise<Order> {
        const orderRepository = getCustomRepository(OrderRepository);
        const customerRepository = getCustomRepository(CustomerRepository);
        const productRepository = getCustomRepository(ProductRepository);

        const customerExists = await customerRepository.findById(customer_id);

        if (!customerExists) {
            throw new AppError('Customer not found');
        }

        const existProducts = await productRepository.findAllByIds(products);

        if (!existProducts.length) {
            throw new AppError('Products not found');
        }

        const existProductIds = existProducts.map(product => product.id);

        const checkInexistentProducts = products.filter(
            product => !existProductIds.includes(product.id),
        );

        if (checkInexistentProducts.length) {
            throw new AppError(
                `Product ${checkInexistentProducts[0].id} not found`,
            );
        }

        const quantityAvailable = products.filter(
            product =>
                existProducts.filter(p => p.id === product.id)[0].quantity <
                product.quantity,
        );

        if (quantityAvailable.length) {
            throw new AppError(
                `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
            );
        }

        const serializedProducts = products.map(product => ({
            product_id: product.id,
            quantity: product.quantity,
            price: existProducts.filter(p => p.id === product.id)[0].price,
        }));

        const order = await orderRepository.createOrder({
            customer: customerExists,
            products: serializedProducts,
        });

        const { order_products } = order;

        const updatedProductQuantity = order_products.map(product => ({
            id: product.product_id,
            quantity:
                existProducts.filter(p => p.id === product.product_id)[0]
                    .quantity - product.quantity,
        }));

        await productRepository.save(updatedProductQuantity);

        return order;
    }
}

export default CreateOrderService;
