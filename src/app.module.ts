import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { McpModule } from './mcp/mcp.module';

@Module({
  imports: [TasksModule, McpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
