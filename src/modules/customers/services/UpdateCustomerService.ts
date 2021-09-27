import AppError from '@shared/errors/AppError';
import { ICustomer } from '../domain/models/ICustomer';
import { IUpdateCustomer } from '../domain/models/IUpdateCustomer';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class UpdateCustomerService {
    constructor(
        @inject('CustomerRepository')
        private customerRepository: ICustomerRepository,
    ) {}

    public async execute({
        id,
        name,
        email,
    }: IUpdateCustomer): Promise<ICustomer> {
        const customer = await this.customerRepository.findById(id);

        if (!customer) {
            throw new AppError('Customer not found');
        }

        const customerUpdateEmail = await this.customerRepository.findByEmail(
            email,
        );

        if (customerUpdateEmail && customerUpdateEmail.id !== id) {
            throw new AppError('There is already one customer with this email');
        }

        customer.name = name;
        customer.email = email;

        await this.customerRepository.save(customer);

        return customer;
    }
}

export default UpdateCustomerService;
