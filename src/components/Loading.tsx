/** @jsxImportSource theme-ui */
import { ClimbingBoxLoader } from "react-spinners";
import { useThemeUI } from "theme-ui";

export default function Loading() {
  const themeUI = useThemeUI();

  return (
    <div
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ClimbingBoxLoader
        loading
        size={20}
        color={themeUI.theme.colors!.primary!.toString()}
        css=""
        speedMultiplier={1}
      />
      <p sx={{ color: "primary", fontWeight: 600, fontSize: 4 }}>
        Loading data...
      </p>
    </div>
  );
}
