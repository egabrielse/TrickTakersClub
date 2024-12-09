import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#044885",
    },
    secondary: {
      main: "#941111",
    },
    background: {
      default: "#4b7c34",
      paper: "#94bc81",
    },
    text: {
      primary: "#ffffff",
      disabled: "rgba(255,255,255,0.5)",
      secondary: "rgba(255,255,255,0.75)",
    },
    divider: "#ffffff",
  },
  typography: {
    fontFamily: "Courier",
    h1: {
      fontSize: "3rem",
      textTransform: "uppercase",
      fontWeight: 1000,
      textDecoration: "underline",
      textUnderlineOffset: "0.2em",
    },
    h2: {
      textTransform: "uppercase",
      fontSize: "2.5rem",
      fontWeight: 800,
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 800,
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 400,
    },
    body1: {
      fontSize: "14px",
      fontWeight: 300,
    },
    body2: {
      fontSize: "12px",
      fontWeight: 200,
    },
    button: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
        variant: "contained",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiRadio: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: "dense",
        size: "small",
        variant: "outlined",
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "capitalize",
        },
      },
      defaultProps: {
        size: "small",
      },
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: "small",
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function MuiThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
