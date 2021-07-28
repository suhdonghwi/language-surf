/** @jsxImportSource theme-ui */
import { useCallback, useState } from "react";
import { ThemeProvider } from "theme-ui";
import { FaBars } from "react-icons/fa";

import theme from "./theme";
import LanguageNetwork from "./components/LanguageNetwork";
import Sidebox from "./components/Sidebox";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [layoutIndex, setLayoutIndex] = useState(0);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedParadigm, setSelectedParadigm] = useState<string | null>(null);
  const [selectedTyping, setSelectedTyping] = useState<string | null>(null);

  const onClose = useCallback(() => {
    if (selectedLanguage === null) setShowSidebar(false);
    else setSelectedLanguage(null);
  }, [selectedLanguage]);

  const onSelectLanguage = useCallback((id: string) => {
    setSelectedLanguage(id);
    setShowSidebar(true);
  }, []);

  const onSearchLanguage = useCallback((id: string) => {
    setSelectedParadigm(null);
    setSelectedLanguage(id);
  }, []);

  const onSearchParadigm = useCallback((id: string | null) => {
    setSelectedTyping(null);
    setSelectedParadigm(id);
  }, []);

  const onSearchTyping = useCallback((id: string | null) => {
    setSelectedParadigm(null);
    setSelectedTyping(id);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LanguageNetwork
        layoutIndex={layoutIndex}
        onClick={onSelectLanguage}
        selectedLanguage={selectedLanguage}
        selectedParadigm={selectedParadigm}
        selectedTyping={selectedTyping}
      />
      <Sidebox
        visible={showSidebar}
        onClose={onClose}
        layoutIndex={layoutIndex}
        selectedLanguage={selectedLanguage}
        selectedParadigm={selectedParadigm}
        selectedTyping={selectedTyping}
        onChangeLayout={setLayoutIndex}
        onSelectLanguage={onSelectLanguage}
        onSearchLanguage={onSearchLanguage}
        onSearchParadigm={onSearchParadigm}
        onSearchTyping={onSearchTyping}
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
