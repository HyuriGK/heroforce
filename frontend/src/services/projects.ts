import {
  AuthUser,
  Project,
  ProjectFilters,
  ProjectPayload,
} from "../types/api";
import { apiRequest } from "./api";

function toQueryString(filters: ProjectFilters): string {
  const params = new URLSearchParams();

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.responsibleId) {
    params.set("responsibleId", filters.responsibleId);
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export function listProjects(
  filters: ProjectFilters,
  token: string,
): Promise<Project[]> {
  return apiRequest<Project[]>(`/projects${toQueryString(filters)}`, {}, token);
}

export function getProject(id: string, token: string): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, {}, token);
}

export function listHeroes(token: string): Promise<AuthUser[]> {
  return apiRequest<AuthUser[]>("/users/heroes", {}, token);
}

export function createProject(
  payload: ProjectPayload,
  token: string,
): Promise<Project> {
  return apiRequest<Project>(
    "/projects",
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
}

export function updateProject(
  id: string,
  payload: ProjectPayload,
  token: string,
): Promise<Project> {
  return apiRequest<Project>(
    `/projects/${id}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    token,
  );
}

export function deleteProject(id: string, token: string): Promise<void> {
  return apiRequest<void>(`/projects/${id}`, { method: "DELETE" }, token);
}
