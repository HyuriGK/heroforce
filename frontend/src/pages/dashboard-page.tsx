import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Filter,
  Plus,
  RefreshCw,
  Shield,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageLoader } from "../components/page-loader";
import { useAuth } from "../contexts/auth-context";
import { ApiError } from "../services/api";
import { deleteProject, listHeroes, listProjects } from "../services/projects";
import { AuthUser, Project, ProjectFilters, ProjectStatus } from "../types/api";
import { formatDate, goalLabels, statusLabels } from "../utils/project";

const statusOrder: ProjectStatus[] = ["pendente", "em_andamento", "concluido"];

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`status-badge status-${status}`}>
      {statusLabels[status]}
    </span>
  );
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div
      className="progress-ring"
      style={{ "--progress": `${value * 3.6}deg` } as CSSProperties}
      aria-label={`${value}% de progresso`}
    >
      <span>{value}%</span>
    </div>
  );
}

export function DashboardPage() {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [heroes, setHeroes] = useState<AuthUser[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const isAdmin = user?.role === "admin";

  async function loadDashboard(nextFilters = filters) {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [projectList, heroList] = await Promise.all([
        listProjects(nextFilters, token),
        isAdmin ? listHeroes(token) : Promise.resolve([]),
      ]);
      setProjects(projectList);
      setHeroes(heroList);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Não foi possível carregar os projetos.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
    // loadDashboard intentionally reads the current filters after interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAdmin]);

  const summary = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        count: projects.filter((project) => project.status === status).length,
      })),
    [projects],
  );

  async function handleFilterChange(nextFilters: ProjectFilters) {
    setFilters(nextFilters);
    await loadDashboard(nextFilters);
  }

  async function handleDelete(project: Project) {
    if (!token || !window.confirm(`Excluir o projeto “${project.name}”?`)) {
      return;
    }

    setDeletingId(project.id);

    try {
      await deleteProject(project.id, token);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Não foi possível excluir o projeto.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading && !projects.length) {
    return <PageLoader />;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Projetos</p>
          <h1>Visão geral</h1>
          <p>
            {isAdmin
              ? "Acompanhe o portfólio, ajuste responsabilidades e mantenha o progresso atualizado."
              : `Olá, ${user?.name.split(" ")[0]}. Estes são os projetos sob sua responsabilidade.`}
          </p>
        </div>
        {isAdmin && (
          <Link to="/projects/new" className="primary-button header-action">
            <Plus size={18} /> Criar projeto
          </Link>
        )}
      </header>

      <section className="summary-grid" aria-label="Resumo dos projetos">
        <article className="summary-card summary-total">
          <span>Total visível</span>
          <strong>{projects.length}</strong>
          <small>projetos visíveis</small>
        </article>
        {summary.map(({ status, count }) => (
          <article className="summary-card" key={status}>
            <StatusBadge status={status} />
            <strong>{count}</strong>
            <small>{statusLabels[status].toLowerCase()}</small>
          </article>
        ))}
      </section>

      <section className="filter-panel" aria-label="Filtros de projetos">
        <div className="filter-heading">
          <Filter size={18} />
          <span>Filtros</span>
        </div>
        <label>
          Status
          <select
            value={filters.status ?? ""}
            onChange={(event) =>
              void handleFilterChange({
                ...filters,
                status: (event.target.value || undefined) as
                  ProjectStatus | undefined,
              })
            }
          >
            <option value="">Todos os status</option>
            {statusOrder.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        {isAdmin && (
          <label>
            Herói responsável
            <select
              value={filters.responsibleId ?? ""}
              onChange={(event) =>
                void handleFilterChange({
                  ...filters,
                  responsibleId: event.target.value || undefined,
                })
              }
            >
              <option value="">Todos os heróis</option>
              {heroes.map((hero) => (
                <option key={hero.id} value={hero.id}>
                  {hero.name} · {hero.character}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          type="button"
          className="ghost-button filter-reset"
          onClick={() => void handleFilterChange({})}
          disabled={!filters.status && !filters.responsibleId}
        >
          <RefreshCw size={16} /> Limpar filtros
        </button>
      </section>

      {error && (
        <div className="feedback feedback-error" role="alert">
          <AlertCircle size={19} />
          <span>{error}</span>
          <button type="button" onClick={() => void loadDashboard()}>
            Tentar novamente
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="inline-loader" role="status">
          <span className="spinner" aria-hidden="true" /> Atualizando
          projetos...
        </div>
      ) : projects.length === 0 ? (
        <section className="empty-state">
          <SlidersHorizontal size={28} />
          <h2>Nenhum projeto encontrado</h2>
          <p>
            {isAdmin
              ? "Ajuste os filtros ou crie o primeiro projeto para começar o acompanhamento."
              : "Quando você for definido como responsável por um projeto, ele aparecerá aqui."}
          </p>
          {isAdmin && (
            <Link to="/projects/new" className="primary-button">
              <Plus size={18} /> Criar projeto
            </Link>
          )}
        </section>
      ) : (
        <section className="project-grid" aria-label="Lista de projetos">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-card-topline">
                <StatusBadge status={project.status} />
                {isAdmin && (
                  <div className="project-card-actions">
                    <Link
                      to={`/projects/${project.id}/edit`}
                      aria-label={`Editar ${project.name}`}
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Excluir ${project.name}`}
                      onClick={() => void handleDelete(project)}
                      disabled={deletingId === project.id}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                )}
              </div>
              <div className="project-title-row">
                <div>
                  <h2>{project.name}</h2>
                  <p>{project.description}</p>
                </div>
                <ProgressRing value={project.progress} />
              </div>
              <div className="responsible-line">
                <span className="avatar avatar-small" aria-hidden="true">
                  {project.responsible.name.slice(0, 1).toUpperCase()}
                </span>
                <span>
                  <strong>{project.responsible.name}</strong>
                  <small>{project.responsible.character}</small>
                </span>
                {project.responsible.role === "admin" && <Shield size={15} />}
              </div>
              <div className="goal-list">
                {Object.entries(project.goals).map(([key, value]) => (
                  <div className="goal-row" key={key}>
                    <span>{goalLabels[key as keyof typeof goalLabels]}</span>
                    <div
                      aria-label={`${goalLabels[key as keyof typeof goalLabels]}: ${value}%`}
                    >
                      <i style={{ width: `${value}%` }} />
                    </div>
                    <strong>{value}%</strong>
                  </div>
                ))}
              </div>
              <footer>Atualizado em {formatDate(project.updatedAt)}</footer>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
