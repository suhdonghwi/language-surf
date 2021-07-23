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

  return (
    <ThemeProvider theme={theme}>
      <LanguageNetwork layoutIndex={layoutIndex} />
      <Sidebox
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        layoutIndex={layoutIndex}
        onChangeLayout={(l) => setLayoutIndex(l)}
      />
      <button
        onClick={() => setShowSidebar(true)}
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: 3,
          left: 0,
          appearance: "none",
          borderWidth: "2px 2px 2px 0",
          borderStyle: "solid",
          borderColor: "gray",
          borderRadius: "0 10px 10px 0",
          color: "darkGray",
          backgroundColor: "lightGray",
          width: "3.5rem",
          height: "3.5rem",
          transition: "all 0.3s",
          "&:hover": {
            backgroundColor: "primary",
            color: "white",
            borderColor: "#a5d8ff",
          },
        }}
      >
        <FaBars sx={{ fontSize: 5 }} />
      </button>
    </ThemeProvider>
  );
}

export default App;
