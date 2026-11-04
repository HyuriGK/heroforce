import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { ProjectStatus } from '../entities/project-status.enum';

export class CreateProjectDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(5000)
  description!: string;

  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @IsUUID('4')
  responsibleId!: string;

  @IsInt()
  @Min(0)
  @Max(100)
  agility!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  enchantment!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  efficiency!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  excellence!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  transparency!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  ambition!: number;
}
