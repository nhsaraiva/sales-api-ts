import { Request, Response } from 'express';
import CreateSessionService from '../../../services/CreateSessionService';
import { classToClass } from 'class-transformer';

export default class SessionController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const createSessionService = new CreateSessionService();

        const { email, password } = request.body;

        const user = await createSessionService.execute({ email, password });

        return response.json(classToClass(user));
    }
}
