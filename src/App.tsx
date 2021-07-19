import { ThemeProvider } from "theme-ui";

import LanguageNetwork from "./components/LanguageNetwork";
import Sidebox from "./components/Sidebox";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LanguageNetwork />
      <Sidebox />
    </ThemeProvider>
  );
}

export default App;
