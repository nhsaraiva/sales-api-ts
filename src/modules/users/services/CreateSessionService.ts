import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { Secret, sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../infra/typeorm/entities/Users';
import UserRepository from '../infra/typeorm/repositories/UserRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IReponse {
    user: User;
    token: string;
}

class CreateSessionService {
    public async execute({ email, password }: IRequest): Promise<IReponse> {
        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const passwordConfirmed = await compare(password, user.password);

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
