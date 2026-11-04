import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { ProjectStatus } from '../entities/project-status.enum';

export class ProjectFilterDto {
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID('4')
  responsibleId?: string;
}
