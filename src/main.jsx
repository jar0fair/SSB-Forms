import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // keep if you’re using Tailwind or any global CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
