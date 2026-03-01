// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
