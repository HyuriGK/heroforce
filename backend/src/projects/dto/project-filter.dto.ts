import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { ProjectStatus } from '../entities/project-status.enum';

export class ProjectFilterDto {
  @ApiPropertyOptional({
    enum: ProjectStatus,
    example: ProjectStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({
    description: 'UUID do herói responsável; disponível para administradores.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  responsibleId?: string;
}
