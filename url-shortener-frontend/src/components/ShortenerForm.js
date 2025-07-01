import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  IconButton,
  Box,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

const API_URL = "https://short-28fd.onrender.com/shorturls";

const ShortenerForm = () => {
  const theme = useTheme();
  const [url, setUrl] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [validity, setValidity] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      const payload = {
        url: url.trim(),
        ...(shortcode.trim() && { shortcode: shortcode.trim() }),
        ...(validity.trim() && { validity: parseInt(validity) }),
      };

      const res = await axios.post(API_URL, payload);
      setResponse(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response.shortUrl);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Enter Long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Custom Shortcode (optional)"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Validity in Minutes (optional)"
        type="number"
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2, bgcolor: "#1976d2", "&:hover": { bgcolor: "#115293" } }}
      >
        Generate Short URL
      </Button>

      {response && (
        <Card
          sx={{
            mt: 4,
            bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
            transition: "transform 0.3s",
            ":hover": { transform: "scale(1.02)" },
            boxShadow: 4,
            borderRadius: 2,
            wordBreak: "break-word",
          }}
        >
          <CardContent>
            <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
              <strong>Short URL: </strong>
              <a
                href={response.shortUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#388e3c", fontWeight: 600 }}
              >
                {response.shortUrl}
              </a>
              <IconButton onClick={handleCopy} size="small" sx={{ ml: 1 }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Expires At:</strong>{" "}
              {new Date(response.expiresAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ShortenerForm;
