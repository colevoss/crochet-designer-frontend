import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DesignProvider, State } from "./design/index.ts";

const state = new State({
  cols: 50,
  rows: 50,
  size: 1,
  id: "designer",
  historySize: 10,
});

ReactDOM.createRoot(document.getElementById("toolbar")!).render(
  <React.StrictMode>
    <DesignProvider design={state}>
      <App />
    </DesignProvider>
  </React.StrictMode>,
);
