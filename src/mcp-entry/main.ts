import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { McpServerService } from 'src/mcp/mcp.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
    });

    const mcpServer = app.get(McpServerService);

    await mcpServer.startStdioServer();

    process.on('SIGINT', async () => {
        await app.close();
        process.exit(0);
    });
}

bootstrap();