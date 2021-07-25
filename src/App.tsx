/** @jsxImportSource theme-ui */
import { useState } from "react";
import { ThemeProvider } from "theme-ui";
import { FaBars } from "react-icons/fa";

import theme from "./theme";
import LanguageNetwork from "./components/LanguageNetwork";
import Sidebox from "./components/Sidebox";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <LanguageNetwork layoutIndex={layoutIndex} />
      <Sidebox
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        layoutIndex={layoutIndex}
        selectedLanguage={selectedLanguage}
        onChangeLayout={(l) => setLayoutIndex(l)}
      />
      <button
        onClick={() => setShowSidebar(true)}
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: 3,
          left: 0,
          variant: "buttons.normal",
          borderWidth: "2px 2px 2px 0",
          borderRadius: "0 10px 10px 0",
          width: "3.5rem",
          height: "3.5rem",
          "&:hover": {
            variant: "buttons.hover",
          },
        }}
      >
        <FaBars sx={{ fontSize: 5 }} />
      </button>
    </ThemeProvider>
  );
}

export default App;
