import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import ListUserService from '../services/ListUserService';
import { classToClass } from 'class-transformer';

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

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            name,
            email,
            password,
        });

        return response.json(classToClass(user));
    }
}
