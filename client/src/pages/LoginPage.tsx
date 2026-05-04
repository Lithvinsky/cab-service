import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api, getApiErrorMessage, unwrap } from "../services/api";
import { useAppDispatch } from "../hooks";
import { setCredentials } from "../store/authSlice";
import type { User } from "../types";

type LoginData = { user: User; token: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await unwrap<LoginData>(
        api.post("/api/auth/login", { email, password })
      );
      dispatch(setCredentials({ user: data.user, token: data.token }));
      if (data.user.role === "ADMIN") navigate("/admin");
      else navigate("/app");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Corporate cab booking — use your company email.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={submit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Log in
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          No account?{" "}
          <Link component={RouterLink} to="/register">
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
