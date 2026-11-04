import { PublicUser } from '../../users/types/public-user.type';
import { ProjectStatus } from '../entities/project-status.enum';

export interface ProjectGoals {
  agility: number;
  enchantment: number;
  efficiency: number;
  excellence: number;
  transparency: number;
  ambition: number;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  goals: ProjectGoals;
  progress: number;
  responsible: PublicUser;
  createdAt: Date;
  updatedAt: Date;
}
