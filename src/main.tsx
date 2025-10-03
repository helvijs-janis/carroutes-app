import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "@/components/ui/provider";
import { Theme } from "@chakra-ui/react";

createRoot(document.getElementById("root")!).render(
  <Provider>
    <Theme appearance="light">
      <App />
    </Theme>
  </Provider>
);
