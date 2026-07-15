import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="bottom-right" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>
);
