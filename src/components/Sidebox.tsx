/** @jsxImportSource theme-ui */
import { FaAngleLeft, FaTimes } from "react-icons/fa";
import Select from "react-virtualized-select";
import ReactMarkdown from "react-markdown";

import { languageData } from "../data/Language";
import layouts from "../data/Layout";
import { Themed as themed } from "theme-ui";

function cutSentences(input: string, n: number) {
  let result = "",
    temp = "";
  let count = 0;
  for (const ch of input) {
    temp += ch;
    if (ch === "." && temp.length > 10) {
      result += temp;
      temp = "";
      count++;

      if (count >= n) {
        return result;
      }
    }
  }

  return input;
}

interface SideboxProps {
  visible: boolean;
  layoutIndex: number;
  selectedLanguage: string | null;

  onChangeLayout(newIndex: number): void;
  onSelectLanguage(key: string): void;
  onSearchLanguage(key: string): void;
  onClose(): void;
}

function HomePage({
  layoutIndex,
  onChangeLayout,
  onSearchLanguage,
}: SideboxProps) {
  return (
    <>
      <themed.h1 sx={{ marginBottom: 3 }}>🏄 Language Surf</themed.h1>
      <p sx={{ marginBottom: 0 }}>
        Surf among 500+ different programming languages! Supports various
        visualization methods.
      </p>
      <p>
        Arrows in the network represent paradigm influence relationship between
        two programming languages.
      </p>
      <themed.h2>🧩 Layout</themed.h2>
      <Select<number>
        sx={{ width: "100%" }}
        options={layouts.map((l, i) => ({ label: l.name(), value: i }))}
        value={layoutIndex}
        onChange={(e) => onChangeLayout((e as any).value)}
        clearable={false}
        searchable={false}
      />
      <themed.h2>🔎 Search for languages</themed.h2>
      <Select<string>
        sx={{ width: "100%" }}
        options={Object.entries(languageData).map(([id, lang]) => ({
          label: lang.label,
          value: id,
        }))}
        onChange={(e) => onSearchLanguage((e as any).value)}
        placeholder="Search for languages"
      />
    </>
  );
}

function LanguagePage({ selectedLanguage }: { selectedLanguage: string }) {
  const lang = languageData[Number(selectedLanguage)];

  return (
    <>
      <themed.h1 sx={{ fontSize: 5, marginBottom: 2, textAlign: "center" }}>
        {lang.label}
      </themed.h1>
      <ReactMarkdown>{cutSentences(lang.description, 2)}</ReactMarkdown>
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
        width: "21rem",
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
          fontSize: 4,
          variant: "buttons.normal",
          "&:hover": {
            variant: "buttons.hover",
          },
        }}
      >
        {selectedLanguage === null ? (
          <FaTimes sx={{ marginTop: 1 }} />
        ) : (
          <FaAngleLeft sx={{ marginTop: 1 }} />
        )}
      </button>
      {selectedLanguage === null ? (
        <HomePage {...props} />
      ) : (
        <LanguagePage selectedLanguage={selectedLanguage} />
      )}
    </aside>
  );
}
