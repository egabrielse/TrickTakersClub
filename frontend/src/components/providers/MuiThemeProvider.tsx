import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#044885",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#4b7c34",
      paper: "rgba(255,255,255,0.4)",
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
      fontWeight: "bolder",
    },
    h2: {
      textTransform: "uppercase",
      fontSize: "2.5rem",
      fontWeight: "bolder",
    },
    h3: {
      fontSize: "2rem",
    },
    h4: {
      fontSize: "1.75rem",
    },
    h5: {
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1.25rem",
    },
    body1: {
      fontSize: "14px",
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
  },
});

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function MuiThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
