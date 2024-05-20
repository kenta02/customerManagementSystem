import React, { StrictMode } from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
// ReactDOM.render(<App />, document.getElementById("root"));
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")).render(<App />);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
