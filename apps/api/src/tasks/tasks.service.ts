import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './task.entity.js';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

  findAll(): Promise<Task[]> {
    return this.repo.find({ order: { done: 'ASC', createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Tarea ${id} no encontrada`);
    return task;
  }

  create(dto: CreateTaskDto): Promise<Task> {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    return this.repo.save(this.repo.merge(task, dto));
  }

  async remove(id: string): Promise<void> {
    const { affected } = await this.repo.delete(id);
    if (!affected) throw new NotFoundException(`Tarea ${id} no encontrada`);
  }
}
