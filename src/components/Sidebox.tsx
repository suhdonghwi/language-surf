/** @jsxImportSource theme-ui */
import { FaAngleLeft } from "react-icons/fa";
import Select from "react-virtualized-select";

import Layout from "../data/Layout";

interface SideboxProps {
  visible: boolean;
  layout: Layout;

  onChangeLayout(newLayout: Layout): void;
  onClose(): void;
}

export default function Sidebox({
  visible,
  layout,
  onChangeLayout,
  onClose,
}: SideboxProps) {
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
          appearance: "none",
          width: "100%",
          padding: 1,
          backgroundColor: "lightGray",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "gray",
          borderRadius: 5,
          color: "darkGray",
        }}
      >
        <FaAngleLeft sx={{ fontSize: 4, marginTop: 1 }} />
      </button>
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
      <Select<Layout>
        sx={{ width: "100%" }}
        options={[
          { label: "Force-based layout", value: "force" },
          { label: "Random layout", value: "random" },
        ]}
        value={layout}
        onChange={(e) => onChangeLayout((e as any).value)}
        clearable={false}
        searchable={false}
      />
    </aside>
  );
}
