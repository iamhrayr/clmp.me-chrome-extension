import React from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";

import AuthProvider from "./modules/auth/provider";
import queryClient from "./queryClient";

import "./index.css";
import App from "./components/App";

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
