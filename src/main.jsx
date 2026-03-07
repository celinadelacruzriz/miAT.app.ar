import { AuthProvider } from "./context/AuthProvider";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import { initMercadoPago } from "@mercadopago/sdk-react";

// Inicializamos MercadoPago con la Public Key de las variables de entorno
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>,
);

