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
            dark: "#2ecc7111"
        },
        error: {
            main: "#d32f2f",
            dark: "#d32f2f11",
        },
    },
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 5,
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                "*": {
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                },
                "*::-webkit-scrollbar": {
                    display: "none",
                },
            },
        },
    },
    typography: {
        fontFamily: "inherit",
    },
});

export default theme;