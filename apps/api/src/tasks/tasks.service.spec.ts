import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity.js';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  let service: TasksService;
  const repo = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn((dto) => dto),
    save: vi.fn(async (t) => ({ id: 'uuid-1', done: false, ...t })),
    merge: vi.fn((t, dto) => ({ ...t, ...dto })),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [TasksService, { provide: getRepositoryToken(Task), useValue: repo }],
    }).compile();
    service = moduleRef.get(TasksService);
  });

  it('crea una tarea', async () => {
    const task = await service.create({ title: 'Escribir tests' });
    expect(task).toMatchObject({ id: 'uuid-1', title: 'Escribir tests', done: false });
  });

  it('marca una tarea como hecha', async () => {
    repo.findOneBy.mockResolvedValue({ id: 'uuid-1', title: 'x', done: false });
    const task = await service.update('uuid-1', { done: true });
    expect(task.done).toBe(true);
  });

  it('lanza 404 si la tarea no existe', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza 404 al borrar una tarea inexistente', async () => {
    repo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});
