import { createTheme } from "@mui/material/styles";

// https://www.color-hex.com/color-palette/1072357
const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#2ecc71",
        }
    },
    shape: {
        borderRadius: 5,
    },
    typography: {
        fontFamily: "inherit",
    },
});

export default theme;