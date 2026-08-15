import { Module } from '@nestjs/common';
import { McpServerService } from './mcp.service';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  providers: [McpServerService],
  exports: [McpServerService],
  imports: [TasksModule],
})
export class McpModule { }