import { ThemeProvider } from "theme-ui";

import LanguageNetwork from "./components/LanguageNetwork";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LanguageNetwork />
    </ThemeProvider>
  );
}

export default App;
