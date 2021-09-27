import { IPaginationCustomer } from '../domain/models/IPaginationCustomer';
import { injectable, inject } from 'tsyringe';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';

@injectable()
class ListCustomerService {
    constructor(
        @inject('CustomerRepository')
        private customerRepository: ICustomerRepository,
    ) {}

    public async execute(): Promise<IPaginationCustomer> {
        const customers = await this.customerRepository.findAllPaginate();

        return customers as IPaginationCustomer;
    }
}

export default ListCustomerService;
