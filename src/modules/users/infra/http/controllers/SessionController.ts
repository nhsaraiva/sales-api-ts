import { Request, Response } from 'express';
import CreateSessionService from '../../../services/CreateSessionService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

export default class SessionController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const createSessionService = container.resolve(CreateSessionService);

        const { email, password } = request.body;

        const user = await createSessionService.execute({ email, password });

        return response.json(classToClass(user));
    }
}
