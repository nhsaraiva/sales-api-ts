import redisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import ProductCacheKeys from '../cache/ProductCacheKeys';
import { ProductRepository } from '../typeorm/repositories/ProductRepository';

interface IRequest {
    id: string;
}

class DeleteProductService extends ProductCacheKeys {
    public async execute({ id }: IRequest): Promise<void> {
        const productRepository = getCustomRepository(ProductRepository);

        const product = await productRepository.findOne(id);

        if (!product) {
            throw new AppError('Product not found');
        }

        await redisCache.invalidate(this.getRedisListKey());

        await productRepository.remove(product);
    }
}

export default DeleteProductService;
