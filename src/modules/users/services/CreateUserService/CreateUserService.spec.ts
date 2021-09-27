import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import FakeUserRepository from '@modules/users/domain/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let createUserService: CreateUserService;
let fakeHashProvider: FakeHashProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        createUserService = new CreateUserService(
            fakeUserRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'Teste Saraiva',
            email: 'teste@teste.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a a two users with the same email', async () => {
        await createUserService.execute({
            name: 'Teste Saraiva1',
            email: 'teste1@teste.com',
            password: '123456',
        });

        expect(
            createUserService.execute({
                name: 'Teste Saraiva2',
                email: 'teste1@teste.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
