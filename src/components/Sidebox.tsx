/** @jsxImportSource theme-ui */
import { FaAngleLeft } from "react-icons/fa";

interface SideboxProps {
  visible: boolean;
  onClose(): void;
}

export default function Sidebox({ visible, onClose }: SideboxProps) {
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
          backgroundColor: "#f1f3f5",
          border: "2px solid #dee2e6",
          borderRadius: 5,
          color: "#868e96",
        }}
      >
        <FaAngleLeft sx={{ fontSize: 4, marginTop: 1 }} />
      </button>
      <h1 sx={{ fontSize: 5, marginBottom: 3 }}>🏄 Language Surf</h1>
      <p sx={{ marginBottom: 0 }}>
        Surf among 500+ different programming languages! Supports various
        visualization methods.
      </p>
      <p>
        Arrows in the network represent paradigm influence relationship between
        two programming languages.
      </p>
    </aside>
  );
}
