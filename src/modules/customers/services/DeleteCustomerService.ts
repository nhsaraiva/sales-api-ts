import AppError from '@shared/errors/AppError';
import { IRemoveCustomer } from '../domain/models/IRemoveCustomer';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteCustomerService {
    constructor(
        @inject('CustomerRepository')
        private customerRepository: ICustomerRepository,
    ) {}

    public async execute({ id }: IRemoveCustomer): Promise<void> {
        const customer = await this.customerRepository.findById(id);

        if (!customer) {
            throw new AppError('Customer not found');
        }

        await this.customerRepository.remove(customer);
    }
}

export default DeleteCustomerService;
