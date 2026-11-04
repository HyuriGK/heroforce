import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ProjectStatus } from './project-status.enum';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 160 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    enumName: 'projects_status_enum',
    default: ProjectStatus.PENDING,
  })
  status!: ProjectStatus;

  @Column({ type: 'smallint' })
  agility!: number;

  @Column({ type: 'smallint' })
  enchantment!: number;

  @Column({ type: 'smallint' })
  efficiency!: number;

  @Column({ type: 'smallint' })
  excellence!: number;

  @Column({ type: 'smallint' })
  transparency!: number;

  @Column({ type: 'smallint' })
  ambition!: number;

  @Column({ name: 'responsible_id', type: 'uuid' })
  responsibleId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'responsible_id' })
  responsible!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
