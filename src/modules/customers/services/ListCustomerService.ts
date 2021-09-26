import { getCustomRepository } from 'typeorm';
import Customer from '../infra/typeorm/entities/Customer';
import CustomerRepository from '../infra/typeorm/repositories/CustomerRepository';

interface IPaginationCustomer {
    from: number;
    to: number;
    per_page: number;
    total: number;
    current_page: number;
    prev_page: number | null;
    next_page: number | null;
    data: Customer[];
}

class ListCustomerService {
    public async execute(): Promise<IPaginationCustomer> {
        const customerRepository = getCustomRepository(CustomerRepository);

        const customers = await customerRepository
            .createQueryBuilder()
            .paginate();

        return customers as IPaginationCustomer;
    }
}

export default ListCustomerService;
