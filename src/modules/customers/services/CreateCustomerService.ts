import AppError from '@shared/errors/AppError';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomer } from '../domain/models/ICustomer';
import { ICustomerRepository } from '../domain/repositories/ICustomerRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class CreateCustomerService {
    constructor(
        @inject('CustomerRepository')
        private customerRepository: ICustomerRepository,
    ) {}

    public async execute({ name, email }: ICreateCustomer): Promise<ICustomer> {
        const emailExists = await this.customerRepository.findByEmail(email);

        if (emailExists) {
            throw new AppError('Email address already used.');
        }

        const customer = await this.customerRepository.create({
            name,
            email,
        });

        return customer;
    }
}

export default CreateCustomerService;
