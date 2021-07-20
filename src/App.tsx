/** @jsxImportSource theme-ui */
import { useState } from "react";
import { ThemeProvider } from "theme-ui";

import LanguageNetwork from "./components/LanguageNetwork";
import Sidebox from "./components/Sidebox";
import theme from "./theme";

import { FaBars } from "react-icons/fa";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <LanguageNetwork />
      <Sidebox visible={showSidebar} onClose={() => setShowSidebar(false)} />
      <button
        onClick={() => setShowSidebar(true)}
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: 3,
          left: 0,
          appearance: "none",
          border: "none",
          borderRadius: "0 10px 10px 0",
          backgroundColor: "primary",
          boxShadow: "0 4px 12px 0px rgba(0,0,0,.25)",
          width: "3.5rem",
          height: "3.5rem",
          color: "white",
        }}
      >
        <FaBars sx={{ fontSize: 5 }} />
      </button>
    </ThemeProvider>
  );
}

export default App;
