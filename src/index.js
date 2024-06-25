import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./AuthContext";



const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
<AuthProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
</AuthProvider>
  
);

reportWebVitals();
