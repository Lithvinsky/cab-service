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

type RegisterData = { user: User; token: string };

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await unwrap<RegisterData>(
        api.post("/api/auth/register", {
          name,
          email,
          password,
          department: department || undefined,
        })
      );
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/app");
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Employee registration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Email must match your corporate domain (see README / server env).
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={submit}>
          <TextField
            label="Full name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Corporate email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password (min 8 characters)"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Department (optional)"
            fullWidth
            margin="normal"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create account
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login">
            Back to login
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
