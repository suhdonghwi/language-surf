import { Theme } from "theme-ui";

const theme: Theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 28, 32, 48, 64],
  colors: {
    text: "#212529",
    textSecondary: "#ced4da",
    background: "#f8f9fa",
    primary: "#74c0fc",
    lightGray: "#f1f3f5",
    gray: "#dee2e6",
    darkGray: "#868e96",
  },
  buttons: {
    normal: {
      appearance: "none",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "gray",
      borderRadius: "10px",
      color: "darkGray",
      backgroundColor: "lightGray",
      transition: "all 0.3s",
    },
    hover: {
      borderColor: "#a5d8ff",
      color: "white",
      backgroundColor: "primary",
    },
  },
  styles: {
    h1: {
      fontSize: 6,
    },
    h2: {
      width: "100%",
      textAlign: "left",
      marginTop: 4,
    },
  },
};

export default theme;
