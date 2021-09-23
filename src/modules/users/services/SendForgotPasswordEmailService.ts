import EtherealMail from '@config/mail/EtherealMail';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../typeorm/repositories/UserRepository';
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository';
import path from 'path';

interface IRequest {
    email: string;
}

class SendForgotPasswordEmailService {
    public async execute({ email }: IRequest): Promise<void> {
        const userRepository = getCustomRepository(UserRepository);

        const userTokenRepository = getCustomRepository(UserTokenRepository);

        const user = await userRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists.');
        }

        const { token } = await userTokenRepository.generate(user.id);

        const forgotPasswordTemplate = await path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        EtherealMail.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: 'Reset password',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
