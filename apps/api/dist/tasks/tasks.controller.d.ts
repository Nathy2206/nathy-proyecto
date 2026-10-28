import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';
export declare class TasksController {
    private readonly tasks;
    constructor(tasks: TasksService);
    findAll(): Promise<import("./task.entity.js").Task[]>;
    findOne(id: string): Promise<import("./task.entity.js").Task>;
    create(dto: CreateTaskDto): Promise<import("./task.entity.js").Task>;
    update(id: string, dto: UpdateTaskDto): Promise<import("./task.entity.js").Task>;
    remove(id: string): Promise<void>;
}
