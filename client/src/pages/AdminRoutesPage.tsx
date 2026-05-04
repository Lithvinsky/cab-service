import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api, getApiErrorMessage, unwrap } from "../services/api";
import type { RouteDoc } from "../types";

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<RouteDoc[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [areas, setAreas] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const r = await unwrap<{ routes: RouteDoc[] }>(api.get("/api/routes"));
      setRoutes(r.routes);
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pickupAreas = areas
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await unwrap(api.post("/api/routes", { name, description: desc, pickupAreas }));
      setName("");
      setDesc("");
      setAreas("");
      await load();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Routes / zones
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack component="form" onSubmit={create} spacing={2} maxWidth={560}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} multiline minRows={2} />
          <TextField
            label="Pickup areas (comma-separated)"
            value={areas}
            onChange={(e) => setAreas(e.target.value)}
            helperText="e.g. North Gate, Station A"
          />
          <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
            Add route
          </Button>
        </Stack>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Areas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((r) => (
              <TableRow key={r._id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{(r.pickupAreas || []).join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
