import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';
import { Secret, sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/Users';
import UserRepository from '../infra/typeorm/repositories/UserRepository';
import { inject, injectable } from 'tsyringe';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    email: string;
    password: string;
}

interface IReponse {
    user: User;
    token: string;
}

@injectable()
class CreateSessionService {
    constructor(
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IReponse> {
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const passwordConfirmed = await this.hashProvider.compareHash(
            password,
            user.password,
        );

        if (!passwordConfirmed) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const token = sign({}, authConfig.jwt.secret as Secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return { user, token };
    }
}

export default CreateSessionService;
