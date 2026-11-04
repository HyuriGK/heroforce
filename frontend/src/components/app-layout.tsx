import { ClipboardList, LogOut, Plus, Shield, UserRound } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/auth-context";
import { Brand } from "./brand";

export function AppLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  function handleSignOut() {
    signOut();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand-link">
          <Brand />
        </Link>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <NavLink to="/dashboard" className="nav-link">
            <ClipboardList size={19} />
            Projetos
          </NavLink>
          {isAdmin && (
            <NavLink to="/projects/new" className="nav-link">
              <Plus size={19} />
              Novo projeto
            </NavLink>
          )}
        </nav>

        <div className="sidebar-user">
          <span className="avatar" aria-hidden="true">
            {user?.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{user?.name}</strong>
            <span>
              {isAdmin ? <Shield size={13} /> : <UserRound size={13} />}
              {isAdmin ? "Administrador" : user?.character}
            </span>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={handleSignOut}
            aria-label="Sair da HeroForce"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
