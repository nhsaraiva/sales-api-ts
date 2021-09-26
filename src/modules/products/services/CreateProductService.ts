import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import ProductCacheKeys from '../cache/ProductCacheKeys';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductRepository';

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

        const redisCache = new RedisCache();

        const product = productRepository.create({
            name,
            price,
            quantity,
        });

        await redisCache.invalidate(this.redisListKey);

        await productRepository.save(product);

        return product;
    }
}

export default CreateProductService;
