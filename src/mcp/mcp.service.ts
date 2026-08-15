import { Inject, Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class McpServerService {
    private server: McpServer;

    constructor(@Inject(TasksService) private readonly tasksService: TasksService) {
        this.server = new McpServer({
            name: 'nestjs-task-mcp-server',
            version: '0.1.0',
        });

        this.registerTools();
    }

    private registerTools() {
        this.server.tool(
            'list_tasks',
            'List tasks. Optionally filter by status.',
            {
                status: z.enum(['open', 'done']).optional(),
            },
            async ({ status }) => {
                const tasks = this.tasksService.findAll(status);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(tasks, null, 2),
                        },
                    ],
                };
            },
        );

        this.server.tool(
            'create_task',
            'Create a new task.',
            {
                title: z.string().min(1),
                description: z.string().optional(),
            },
            async ({ title, description }) => {
                const task = this.tasksService.create({ title, description });

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(task, null, 2),
                        },
                    ],
                };
            },
        );

        this.server.tool(
            'get_task',
            'Get one task by ID.',
            {
                id: z.string(),
            },
            async ({ id }) => {
                const task = this.tasksService.findOne(id);

                if (!task) {
                    return {
                        isError: true,
                        content: [
                            {
                                type: 'text',
                                text: `Task with id ${id} not found`,
                            },
                        ],
                    };
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(task, null, 2),
                        },
                    ],
                };
            },
        );

        this.server.tool(
            'update_task_status',
            'Update a task status.',
            {
                id: z.string(),
                status: z.enum(['open', 'done']),
            },
            async ({ id, status }) => {
                const task = this.tasksService.updateStatus(id, status);

                if (!task) {
                    return {
                        isError: true,
                        content: [
                            {
                                type: 'text',
                                text: `Task with id ${id} not found`,
                            },
                        ],
                    };
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(task, null, 2),
                        },
                    ],
                };
            },
        );

        this.server.tool(
            'get_task_stats',
            'Get task statistics.',
            {},
            async () => {
                const stats = this.tasksService.getStats();

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(stats, null, 2),
                        },
                    ],
                };
            },
        );
    }

    async startStdioServer() {
        const transport = new StdioServerTransport();

        await this.server.connect(transport);

        // Important: use stderr for logs when using stdio transport.
        // stdout is used by the MCP JSON-RPC protocol.
        console.error('NestJS MCP server running on stdio');
    }
}