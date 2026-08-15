import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type TaskStatus = 'open' | 'done';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: string;
}

@Injectable()
export class TasksService {
    private tasks: Task[] = [
        {
            id: '1',
            title: 'Setup NestJS project',
            description: 'Create initial backend structure',
            status: 'open',
            createdAt: new Date().toISOString(),
        },
    ];

    findAll(status?: TaskStatus): Task[] {
        if (!status) return this.tasks;
        return this.tasks.filter(task => task.status === status);
    }

    findOne(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    create(input: { title: string; description?: string }): Task {
        const task: Task = {
            id: randomUUID(),
            title: input.title,
            description: input.description,
            status: 'open',
            createdAt: new Date().toISOString(),
        };

        this.tasks.push(task);
        return task;
    }

    updateStatus(id: string, status: TaskStatus): Task | undefined {
        const task = this.findOne(id);

        if (!task) {
            return undefined;
        }

        task.status = status;
        return task;
    }

    getStats() {
        return {
            total: this.tasks.length,
            open: this.tasks.filter(task => task.status === 'open').length,
            done: this.tasks.filter(task => task.status === 'done').length,
        };
    }
}