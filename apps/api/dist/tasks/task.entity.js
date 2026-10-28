var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
let Task = class Task {
    id;
    title;
    done;
    createdAt;
    updatedAt;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    Column({ length: 120 }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], Task.prototype, "done", void 0);
__decorate([
    CreateDateColumn({ name: 'created_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
Task = __decorate([
    Entity({ name: 'tasks' })
], Task);
export { Task };
//# sourceMappingURL=task.entity.js.map