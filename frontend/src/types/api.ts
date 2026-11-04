export type UserRole = "admin" | "hero";

export type ProjectStatus = "concluido" | "em_andamento" | "pendente";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  character: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  user: AuthUser;
}

export interface ProjectGoals {
  agility: number;
  enchantment: number;
  efficiency: number;
  excellence: number;
  transparency: number;
  ambition: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  goals: ProjectGoals;
  progress: number;
  responsible: AuthUser;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPayload extends ProjectGoals {
  name: string;
  description: string;
  status: ProjectStatus;
  responsibleId: string;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  responsibleId?: string;
}
