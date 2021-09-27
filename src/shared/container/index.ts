import { container } from 'tsyringe';

import { ICustomerRepository } from '@modules/customers/domain/repositories/ICustomerRepository';
import CustomerRepository from '@modules/customers/infra/typeorm/repositories/CustomerRepository';

import '@modules/users/providers';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

container.registerSingleton<ICustomerRepository>(
    'CustomerRepository',
    CustomerRepository,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
