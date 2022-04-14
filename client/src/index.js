import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import "fomantic-ui-css/fomantic.min.css";
// import "bulma/css/bulma.min.css";
import App from "./App";
import "./i18n";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
