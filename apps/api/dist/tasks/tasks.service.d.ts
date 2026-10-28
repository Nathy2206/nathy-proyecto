import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './task.entity.js';
export declare class TasksService {
    private readonly repo;
    constructor(repo: Repository<Task>);
    findAll(): Promise<Task[]>;
    findOne(id: string): Promise<Task>;
    create(dto: CreateTaskDto): Promise<Task>;
    update(id: string, dto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<void>;
}
