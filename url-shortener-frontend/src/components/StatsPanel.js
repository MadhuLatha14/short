import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const StatsPanel = () => {
  const theme = useTheme();
  const [shortcode, setShortcode] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleGetStats = async () => {
    setError("");
    setData(null);

    if (!shortcode.trim()) {
      setError("Enter a shortcode");
      return;
    }

    // Extract shortcode from full URL if needed
    const cleanedCode = shortcode.trim().replace("http://localhost:5000/", "");

    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${cleanedCode}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch stats.");
    }
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <TextField
        label="Enter Shortcode or Full Short URL"
        fullWidth
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 1,
          bgcolor: "#6a1b9a",
          "&:hover": { bgcolor: "#4a148c" },
        }}
        onClick={handleGetStats}
      >
        Get Stats
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {data && (
        <Card
          sx={{
            mt: 3,
            p: 2,
            bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f3e5f5",
            wordBreak: "break-word",
          }}
        >
          <CardContent>
            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
              <strong>Original URL:</strong> {data.originalUrl}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Expires At:</strong> {new Date(data.expiresAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">
              <strong>Total Clicks:</strong> {data.clickCount}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1"><strong>Click History:</strong></Typography>
            {data.clicks.length === 0 ? (
              <Typography variant="body2">No clicks yet.</Typography>
            ) : (
              data.clicks.map((click, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    • {new Date(click.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="caption">Referrer: {click.referrer}</Typography><br />
                  <Typography variant="caption">Location: {click.location}</Typography>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StatsPanel;
