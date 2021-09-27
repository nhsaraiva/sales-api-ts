import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IHashProvider } from '@modules/users/providers/HashProvider/models/IHashProvider';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { IUser } from '@modules/users/domain/models/IUser';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<IUser> {
        const emailExists = await this.userRepository.findByEmail(email);

        if (emailExists) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
