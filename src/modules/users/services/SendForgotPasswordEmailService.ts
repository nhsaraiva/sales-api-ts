import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../typeorm/repositories/UserRepository';
import UserTokenRepository from '../typeorm/repositories/UserTokenRepository';
import path from 'path';
import EtherealMail from '@config/mail/EtherealMail';
import SESMail from '@config/mail/SESMail';
import mailConfig from '@config/mail/mail';

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

        if (mailConfig.driver === 'ses') {
            SESMail.sendMail({
                to: {
                    name: user.name,
                    email: user.email,
                },
                subject: 'Reset password',
                templateData: {
                    file: forgotPasswordTemplate,
                    variables: {
                        name: user.name,
                        link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
                    },
                },
            });
            return;
        }

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
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
