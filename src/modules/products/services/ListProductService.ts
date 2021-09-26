import redisCache from '@shared/cache/RedisCache';
import { getCustomRepository } from 'typeorm';
import ProductCacheKeys from '../cache/ProductCacheKeys';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductRepository';

class ListProductService extends ProductCacheKeys {
    public async execute(): Promise<Product[]> {
        const productRepository = getCustomRepository(ProductRepository);

        let products = await redisCache.recover<Product[]>(
            this.getRedisListKey(),
        );

        if (!products) {
            products = await productRepository.find();

            await redisCache.save(this.getRedisListKey(), products);
        }

        return products;
    }
}

export default ListProductService;
