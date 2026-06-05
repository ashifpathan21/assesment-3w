import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <App />
        <Toaster />
      </SocketProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
