import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "antd/dist/reset.css";
import App from "./App.tsx";

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
