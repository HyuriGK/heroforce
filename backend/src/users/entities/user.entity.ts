import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from './user-role.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash!: string;

  @Column({ length: 120 })
  character!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.HERO,
  })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
