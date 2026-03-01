// src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg">
          AT Conecta
        </Link>

        {/* Navegación */}
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/avisos">Avisos</Link>
          <Link to="/publicar">Publicar</Link>
          <Link to="/mis-avisos">Mis avisos</Link>
          <button className="text-red-600">Salir</button>
        </nav>
      </div>
    </header>
  );
}
