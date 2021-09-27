import { Request, Response } from 'express';
import CreateCustomerService from '../../../services/CreateCustomerService';
import DeleteCustomerService from '../../../services/DeleteCustomerService';
import ListCustomerService from '../../../services/ListCustomerService';
import ShowCustomerService from '../../../services/ShowCustomerService';
import UpdateCustomerService from '../../../services/UpdateCustomerService';

import { container } from 'tsyringe';

export default class CustomerController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listCustomerService = container.resolve(ListCustomerService);

        const customers = await listCustomerService.execute();

        return response.json(customers);
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showCustomerService = container.resolve(ShowCustomerService);

        const customer = await showCustomerService.execute({ id });

        return response.json(customer);
    }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, email } = request.body;

        const createCustomerService = container.resolve(CreateCustomerService);

        const customer = await createCustomerService.execute({
            name,
            email,
        });

        return response.json(customer);
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const { name, email } = request.body;

        const updateCustomerService = container.resolve(UpdateCustomerService);

        const customer = await updateCustomerService.execute({
            id,
            name,
            email,
        });

        return response.json(customer);
    }

    public async delete(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const deleteCustomerService = container.resolve(DeleteCustomerService);

        await deleteCustomerService.execute({
            id,
        });

        return response.json([]);
    }
}
