import { Request, Response } from 'express';
import ListUserService from '../../../services/ListUserService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService/CreateUserService';

export default class UserController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listUserService = new ListUserService();

        const users = await listUserService.execute();

        return response.json(classToClass(users));
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, email, password } = request.body;

        const createUserService = container.resolve(CreateUserService);

        const user = await createUserService.execute({
            name,
            email,
            password,
        });

        return response.json(classToClass(user));
    }
}
