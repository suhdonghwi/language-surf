/** @jsxImportSource theme-ui */
import { FaAngleLeft } from "react-icons/fa";
import Select from "react-virtualized-select";
import { languageData } from "../data/Language";
import layouts from "../data/Layout";

interface SideboxProps {
  visible: boolean;
  layoutIndex: number;
  selectedLanguage: number | null;

  onChangeLayout(newIndex: number): void;
  onClose(): void;
}

function HomePage({ layoutIndex, onChangeLayout }: SideboxProps) {
  return (
    <>
      <h1 sx={{ fontSize: 6, marginBottom: 2 }}>🏄 Language Surf</h1>
      <p sx={{ marginBottom: 0 }}>
        Surf among 500+ different programming languages! Supports various
        visualization methods.
      </p>
      <p>
        Arrows in the network represent paradigm influence relationship between
        two programming languages.
      </p>
      <h2>Layout</h2>
      <Select<number>
        sx={{ width: "100%" }}
        options={layouts.map((l, i) => ({ label: l.name(), value: i }))}
        value={layoutIndex}
        onChange={(e) => onChangeLayout((e as any).value)}
        clearable={false}
        searchable={false}
      />
    </>
  );
}

function LanguagePage({ selectedLanguage }: { selectedLanguage: number }) {
  return (
    <>
      <h1 sx={{ fontSize: 5, marginBottom: 2, textAlign: "center" }}>
        {languageData[selectedLanguage].label}
      </h1>
      <p>
        Arrows in the network represent paradigm influence relationship between
        two programming languages.
      </p>
    </>
  );
}

export default function Sidebox(props: SideboxProps) {
  const { visible, selectedLanguage, onClose } = props;

  return (
    <aside
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        backgroundColor: "background",
        width: "23rem",
        height: "100%",
        boxShadow: "0 4px 12px 0px rgba(0,0,0,.25)",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: visible ? "" : "translateX(-100%)",
        transition: "transform 0.3s",
      }}
    >
      <button
        onClick={onClose}
        sx={{
          cursor: "pointer",
          width: "100%",
          padding: 1,
          variant: "buttons.normal",
          "&:hover": {
            variant: "buttons.hover",
          },
        }}
      >
        <FaAngleLeft sx={{ fontSize: 4, marginTop: 1 }} />
      </button>
      {selectedLanguage === null ? (
        <HomePage {...props} />
      ) : (
        <LanguagePage selectedLanguage={selectedLanguage} />
      )}
    </aside>
  );
}
