import 'reflect-metadata';
import FakeCustomersRepository from '@modules/customers/domain/repositories/fakes/FakeCustomersRepository';
import CreateCustomerService from './CreateCustomerService';
import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomerService: CreateCustomerService;

describe('CreateCustomer', () => {
    beforeEach(() => {
        fakeCustomersRepository = new FakeCustomersRepository();
        createCustomerService = new CreateCustomerService(
            fakeCustomersRepository,
        );
    });

    it('should be able to create a new customer', async () => {
        const customer = await createCustomerService.execute({
            name: 'Teste Saraiva',
            email: 'teste@teste.com',
        });

        expect(customer).toHaveProperty('id');
    });

    it('should not be able to create a a two customers with the same email', async () => {
        await createCustomerService.execute({
            name: 'Teste Saraiva1',
            email: 'teste1@teste.com',
        });

        expect(
            createCustomerService.execute({
                name: 'Teste Saraiva2',
                email: 'teste1@teste.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
