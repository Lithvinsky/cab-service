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
import type { Driver } from "../types";

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const d = await unwrap<{ drivers: Driver[] }>(api.get("/api/drivers"));
      setDrivers(d.drivers);
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
      await unwrap(api.post("/api/drivers", { name, phone, licenseNumber: license }));
      setName("");
      setPhone("");
      setLicense("");
      await load();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Drivers
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack component="form" onSubmit={create} direction="row" flexWrap="wrap" gap={2}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required size="small" />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required size="small" />
          <TextField label="License" value={license} onChange={(e) => setLicense(e.target.value)} required size="small" />
          <Button type="submit" variant="contained" size="small">Add</Button>
        </Stack>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((d) => (
              <TableRow key={d._id}>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.licenseNumber}</TableCell>
                <TableCell>{d.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
