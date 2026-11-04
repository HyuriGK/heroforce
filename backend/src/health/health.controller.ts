import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({
    summary: 'Verifica a disponibilidade da API e do PostgreSQL.',
  })
  @ApiOkResponse({ description: 'API e banco de dados disponíveis.' })
  async check(): Promise<{
    status: 'ok';
    service: string;
    database: 'up';
    timestamp: string;
  }> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        service: 'heroforce-api',
        database: 'down',
        timestamp: new Date().toISOString(),
      });
    }

    return {
      status: 'ok',
      service: 'heroforce-api',
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}
