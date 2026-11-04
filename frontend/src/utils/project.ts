import { ProjectGoals, ProjectStatus } from "../types/api";

export const goalLabels: Record<keyof ProjectGoals, string> = {
  agility: "Agilidade",
  enchantment: "Encantamento",
  efficiency: "Eficiência",
  excellence: "Excelência",
  transparency: "Transparência",
  ambition: "Ambição",
};

export const statusLabels: Record<ProjectStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

export function calculateProgress(goals: ProjectGoals): number {
  const total = Object.values(goals).reduce((sum, value) => sum + value, 0);

  return Math.round(total / 6);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
