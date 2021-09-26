import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import ProductCacheKeys from '../cache/ProductCacheKeys';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductRepository';

interface IRequest {
    name: string;
    price: number;
    quantity: number;
}

class CreateProductService extends ProductCacheKeys {
    public async execute({
        name,
        price,
        quantity,
    }: IRequest): Promise<Product> {
        const productRepository = getCustomRepository(ProductRepository);

        const productExists = await productRepository.findByName(name);

        if (productExists) {
            throw new AppError('There is already one product with this name');
        }

        const product = productRepository.create({
            name,
            price,
            quantity,
        });

        await redisCache.invalidate(this.getRedisListKey());

        await productRepository.save(product);

        return product;
    }
}

export default CreateProductService;
