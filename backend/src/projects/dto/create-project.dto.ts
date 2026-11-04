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
import { ApiProperty } from '@nestjs/swagger';

import { ProjectStatus } from '../entities/project-status.enum';

export class CreateProjectDto {
  @ApiProperty({ description: 'Nome do projeto.', example: 'Portal HeroForce' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @ApiProperty({
    description: 'Descrição detalhada do projeto.',
    example: 'Portal para gestão de iniciativas heroicas.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(2)
  @MaxLength(5000)
  description!: string;

  @ApiProperty({ enum: ProjectStatus, example: ProjectStatus.IN_PROGRESS })
  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @ApiProperty({
    description: 'UUID de um herói cadastrado.',
    format: 'uuid',
  })
  @IsUUID('4')
  responsibleId!: string;

  @ApiProperty({ minimum: 0, maximum: 100, example: 80 })
  @IsInt()
  @Min(0)
  @Max(100)
  agility!: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 70 })
  @IsInt()
  @Min(0)
  @Max(100)
  enchantment!: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 75 })
  @IsInt()
  @Min(0)
  @Max(100)
  efficiency!: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 90 })
  @IsInt()
  @Min(0)
  @Max(100)
  excellence!: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 85 })
  @IsInt()
  @Min(0)
  @Max(100)
  transparency!: number;

  @ApiProperty({ minimum: 0, maximum: 100, example: 95 })
  @IsInt()
  @Min(0)
  @Max(100)
  ambition!: number;
}
