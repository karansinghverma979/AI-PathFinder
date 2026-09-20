import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initializeSovereignEngine } from "./services/browserEngine.js";

// Initialize In-Browser Engine (enables 100% serverless GitHub Pages live demo)
initializeSovereignEngine();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
