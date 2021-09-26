export default class ProductCacheKeys {
    private redisListKey = 'api-vendas-PRODUCT_LIST';

    public getRedisListKey(): string {
        return this.redisListKey;
    }
}
