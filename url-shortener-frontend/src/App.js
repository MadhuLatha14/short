import React, { useState, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ShortenerForm from "./components/ShortenerForm";
import StatsPanel from "./components/StatsPanel";

function App() {
  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#e0f2f1" : "#121212",
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          bgcolor: "background.default",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1000px",
            height: isMobile ? "auto" : "85vh",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 6,
          }}
        >
          {/* Left Side – Shortener Form */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: theme.palette.mode === "dark" ? "#2c2c2c" : "#f7f7f7",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: theme.palette.text.primary }}
              >
                URL Shortener
              </Typography>
              <IconButton onClick={toggleTheme}>
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>

            <Box sx={{ mt: 2 }}>
              <ShortenerForm />
            </Box>
          </Box>

          {/* Right Side – Stats Panel */}
          <Box
            sx={{
              flex: 1,
              bgcolor: theme.palette.mode === "dark" ? "#2e1a38" : "#e1bee7",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              overflowY: "auto",
            }}
          >
            <StatsPanel />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
