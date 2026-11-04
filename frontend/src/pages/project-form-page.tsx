import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { PageLoader } from "../components/page-loader";
import { useAuth } from "../contexts/auth-context";
import { ApiError } from "../services/api";
import {
  createProject,
  getProject,
  listHeroes,
  updateProject,
} from "../services/projects";
import {
  AuthUser,
  ProjectGoals,
  ProjectPayload,
  ProjectStatus,
} from "../types/api";
import { calculateProgress, goalLabels, statusLabels } from "../utils/project";

const emptyGoals: ProjectGoals = {
  agility: 0,
  enchantment: 0,
  efficiency: 0,
  excellence: 0,
  transparency: 0,
  ambition: 0,
};

const emptyForm: ProjectPayload = {
  name: "",
  description: "",
  status: "pendente",
  responsibleId: "",
  ...emptyGoals,
};

export function ProjectFormPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [heroes, setHeroes] = useState<AuthUser[]>([]);
  const [form, setForm] = useState<ProjectPayload>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadForm() {
      if (!token) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [heroList, project] = await Promise.all([
          listHeroes(token),
          id ? getProject(id, token) : Promise.resolve(null),
        ]);
        setHeroes(heroList);

        if (project) {
          setForm({
            name: project.name,
            description: project.description,
            status: project.status,
            responsibleId: project.responsible.id,
            ...project.goals,
          });
        }
      } catch (requestError) {
        setError(
          requestError instanceof ApiError
            ? requestError.message
            : "Não foi possível carregar o formulário de projeto.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadForm();
  }, [id, token]);

  const progress = useMemo(() => calculateProgress(form), [form]);

  function setField<Key extends keyof ProjectPayload>(
    field: Key,
    value: ProjectPayload[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleGoalChange(
    field: keyof ProjectGoals,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const value = Math.max(0, Math.min(100, Number(event.target.value)));
    setField(field, Number.isFinite(value) ? value : 0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing && id) {
        await updateProject(id, form, token);
      } else {
        await createProject(form, token);
      }

      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Não foi possível salvar o projeto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="project-form-page">
      <header className="form-page-header">
        <div>
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={17} /> Voltar para projetos
          </Link>
          <p className="eyebrow">
            {isEditing ? "Ajustar missão" : "Nova missão"}
          </p>
          <h1>
            {isEditing ? "Editar projeto heroico" : "Criar projeto heroico"}
          </h1>
          <p>
            Defina quem lidera a missão e torne cada valor da HeroForce visível.
          </p>
        </div>
        <div
          className="form-progress-card"
          aria-label={`Progresso atual ${progress}%`}
        >
          <Sparkles size={18} />
          <span>Progresso geral</span>
          <strong>{progress}%</strong>
        </div>
      </header>

      <form className="project-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <div className="section-heading">
            <h2>Essência do projeto</h2>
            <p>Informações que tornam a missão reconhecível no painel.</p>
          </div>
          <div className="form-grid">
            <label className="field-span-2">
              Nome do projeto
              <input
                required
                minLength={2}
                maxLength={160}
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Ex.: Portal HeroForce"
              />
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  setField("status", event.target.value as ProjectStatus)
                }
              >
                {(Object.keys(statusLabels) as ProjectStatus[]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label>
              Herói responsável
              <select
                required
                value={form.responsibleId}
                onChange={(event) =>
                  setField("responsibleId", event.target.value)
                }
              >
                <option value="">Selecione um herói</option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.id}>
                    {hero.name} · {hero.character}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-span-2">
              Descrição
              <textarea
                required
                minLength={2}
                maxLength={5000}
                rows={5}
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                placeholder="Qual impacto esta missão deve gerar?"
              />
            </label>
          </div>
        </section>

        <section className="form-section">
          <div className="section-heading">
            <h2>Metas de impacto</h2>
            <p>
              Use valores de 0 a 100. O progresso é a média das seis dimensões.
            </p>
          </div>
          <div className="goals-editor">
            {(Object.keys(goalLabels) as (keyof ProjectGoals)[]).map((goal) => (
              <label key={goal} className="goal-editor-row">
                <span>{goalLabels[goal]}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form[goal]}
                  onChange={(event) => handleGoalChange(goal, event)}
                />
                <input
                  className="goal-number-input"
                  type="number"
                  min="0"
                  max="100"
                  value={form[goal]}
                  onChange={(event) => handleGoalChange(goal, event)}
                  aria-label={`${goalLabels[goal]} em percentual`}
                />
                <strong>%</strong>
              </label>
            ))}
          </div>
        </section>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <Link to="/dashboard" className="ghost-button">
            Cancelar
          </Link>
          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting
              ? "Salvando missão..."
              : isEditing
                ? "Salvar alterações"
                : "Criar projeto"}
          </button>
        </div>
      </form>
    </div>
  );
}
