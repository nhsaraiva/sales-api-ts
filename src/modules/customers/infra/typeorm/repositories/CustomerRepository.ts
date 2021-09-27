import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { IPaginationCustomer } from '@modules/customers/domain/models/IPaginationCustomer';
import { ICustomerRepository } from '@modules/customers/domain/repositories/ICustomerRepository';
import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

class CustomerRepository implements ICustomerRepository {
    private ormRepository: Repository<Customer>;

    constructor() {
        this.ormRepository = getRepository(Customer);
    }

    public async save(customer: Customer): Promise<Customer> {
        await this.ormRepository.save(customer);

        return customer;
    }

    public async create({ name, email }: ICreateCustomer): Promise<Customer> {
        const customer = await this.ormRepository.create({ name, email });

        await this.ormRepository.save(customer);

        return customer;
    }

    public async remove(customer: Customer): Promise<void> {
        await this.ormRepository.remove(customer);
    }

    public async findAllPaginate(): Promise<IPaginationCustomer> {
        const customers = await this.ormRepository
            .createQueryBuilder()
            .paginate();

        return customers as IPaginationCustomer;
    }

    public async findByName(name: string): Promise<Customer | undefined> {
        const customer = await this.ormRepository.findOne({
            where: {
                name,
            },
        });

        return customer;
    }
    public async findById(id: string): Promise<Customer | undefined> {
        const customer = await this.ormRepository.findOne({
            where: {
                id,
            },
        });

        return customer;
    }
    public async findByEmail(email: string): Promise<Customer | undefined> {
        const customer = await this.ormRepository.findOne({
            where: {
                email,
            },
        });

        return customer;
    }
}

export default CustomerRepository;
