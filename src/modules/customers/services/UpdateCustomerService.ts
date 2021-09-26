import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import CustomerRepository from '../typeorm/repositories/CustomerRepository';
import Customer from '../typeorm/entities/Customer';

interface IRequest {
    id: string;
    name: string;
    email: string;
}

class UpdateCustomerService {
    public async execute({ id, name, email }: IRequest): Promise<Customer> {
        const customerRepository = getCustomRepository(CustomerRepository);

        const customer = await customerRepository.findById(id);

        if (!customer) {
            throw new AppError('Customer not found');
        }

        const customerUpdateEmail = await customerRepository.findByEmail(email);

        if (customerUpdateEmail && customerUpdateEmail.id !== id) {
            throw new AppError('There is already one customer with this email');
        }

        customer.name = name;
        customer.email = email;

        await customerRepository.save(customer);

        return customer;
    }
}

export default UpdateCustomerService;
