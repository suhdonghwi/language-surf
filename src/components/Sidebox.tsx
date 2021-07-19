/** @jsxImportSource theme-ui */

interface SideboxProps {
  visible: boolean;
}

export default function Sidebox({ visible }: SideboxProps) {
  return (
    <aside
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
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
