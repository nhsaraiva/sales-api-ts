import AppError from '@shared/errors/AppError';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/Users';
import UserRepository from '../typeorm/repositories/UserRepository';
import uploadConfig from '@config/uploadConfig';
import fs from 'fs';

interface IRequest {
    user_id: string;
    avatarFilename: string | undefined;
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        if (!avatarFilename) {
            throw new AppError('Avatar name not found');
        }

        const userRepository = getCustomRepository(UserRepository);

        const user = await userRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        if (user.avatar) {
            await this.removeAvatar(user.avatar);
        }

        user.avatar = avatarFilename;

        await userRepository.save(user);

        return user;
    }

    private async removeAvatar(avatar: string) {
        const userAvatarFilePath = path.join(uploadConfig.directory, avatar);

        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

        if (userAvatarFileExists) {
            await fs.promises.unlink(userAvatarFilePath);
        }
    }
}

export default UpdateUserAvatarService;
