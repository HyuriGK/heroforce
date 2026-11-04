import { ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns a healthy status when the database responds', async () => {
    const dataSource = {
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    } as unknown as DataSource;
    const controller = new HealthController(dataSource);

    await expect(controller.check()).resolves.toMatchObject({
      status: 'ok',
      service: 'heroforce-api',
      database: 'up',
    });
    expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('returns service unavailable when the database does not respond', async () => {
    const dataSource = {
      query: jest.fn().mockRejectedValue(new Error('database unavailable')),
    } as unknown as DataSource;
    const controller = new HealthController(dataSource);

    await expect(controller.check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
