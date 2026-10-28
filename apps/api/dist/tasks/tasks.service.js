var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity.js';
let TasksService = class TasksService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find({ order: { done: 'ASC', createdAt: 'DESC' } });
    }
    async findOne(id) {
        const task = await this.repo.findOneBy({ id });
        if (!task)
            throw new NotFoundException(`Tarea ${id} no encontrada`);
        return task;
    }
    create(dto) {
        return this.repo.save(this.repo.create(dto));
    }
    async update(id, dto) {
        const task = await this.findOne(id);
        return this.repo.save(this.repo.merge(task, dto));
    }
    async remove(id) {
        const { affected } = await this.repo.delete(id);
        if (!affected)
            throw new NotFoundException(`Tarea ${id} no encontrada`);
    }
};
TasksService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Task)),
    __metadata("design:paramtypes", [Repository])
], TasksService);
export { TasksService };
//# sourceMappingURL=tasks.service.js.map