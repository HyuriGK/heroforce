import { FormEvent, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { Brand } from "../components/brand";
import { PageLoader } from "../components/page-loader";
import { useAuth } from "../contexts/auth-context";
import { ApiError, apiRequest } from "../services/api";
import { AuthResponse } from "../types/api";

type AuthMode = "login" | "register";

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  const { isInitializing, signIn, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    character: "",
  });
  const isRegister = mode === "register";

  if (isInitializing) {
    return <PageLoader />;
  }

  if (token && user) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister
        ? form
        : { email: form.email, password: form.password };
      const response = await apiRequest<AuthResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      signIn(response);
      const destination = (
        location.state as { from?: { pathname?: string } } | null
      )?.from?.pathname;
      navigate(
        destination && destination !== "/login" ? destination : "/dashboard",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Não foi possível conectar à HeroForce. Verifique se a API está ativa.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Apresentação HeroForce">
        <Brand />
        <div className="auth-hero-copy">
          <p className="eyebrow">
            <Sparkles size={15} /> Central de projetos heroicos
          </p>
          <h1>Transforme valores em impacto mensurável.</h1>
          <p>
            Acompanhe metas, responsáveis e o progresso dos projetos que movem a
            HeroForce.
          </p>
        </div>
        <div className="value-grid" aria-label="Valores da HeroForce">
          {[
            "Agilidade",
            "Encantamento",
            "Eficiência",
            "Excelência",
            "Transparência",
            "Ambição",
          ].map((value, index) => (
            <span
              key={value}
              style={{ "--value-index": index } as CSSProperties}
            >
              {value}
            </span>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-heading">
            <p className="eyebrow">
              {isRegister ? "Junte-se ao time" : "Boas-vindas de volta"}
            </p>
            <h2>
              {isRegister ? "Ative seu perfil heroico" : "Entre na sua central"}
            </h2>
            <p>
              {isRegister
                ? "Escolha seu personagem e acompanhe os projetos sob sua responsabilidade."
                : "Use suas credenciais para continuar sua missão."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label>
                  Nome completo
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Ex.: Carol Danvers"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Personagem
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.character}
                    onChange={(event) =>
                      updateField("character", event.target.value)
                    }
                    placeholder="Ex.: Capitã Marvel"
                  />
                </label>
              </>
            )}

            <label>
              E-mail
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="voce@exemplo.com"
                autoComplete="email"
              />
            </label>

            <label>
              Senha
              <span className="password-input">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  placeholder="Mínimo de 8 caracteres"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Preparando missão..."
                : isRegister
                  ? "Criar perfil heroico"
                  : "Entrar na HeroForce"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-switch">
            {isRegister
              ? "Já possui um perfil?"
              : "Ainda não possui um perfil?"}{" "}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Fazer login" : "Cadastre-se"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
