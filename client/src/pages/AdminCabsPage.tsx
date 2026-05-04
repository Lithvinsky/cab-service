import {
  Box,
  Button,
  MenuItem,
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
import type { Cab, Driver, RouteDoc } from "../types";

export default function AdminCabsPage() {
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<RouteDoc[]>([]);
  const [reg, setReg] = useState("");
  const [cap, setCap] = useState("4");
  const [driverId, setDriverId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const [c, d, r] = await Promise.all([
        unwrap<{ cabs: Cab[] }>(api.get("/api/cabs")),
        unwrap<{ drivers: Driver[] }>(api.get("/api/drivers")),
        unwrap<{ routes: RouteDoc[] }>(api.get("/api/routes")),
      ]);
      setCabs(c.cabs);
      setDrivers(d.drivers);
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
    setErr(null);
    try {
      await unwrap(
        api.post("/api/cabs", {
          registrationNumber: reg,
          capacity: Number(cap),
          assignedDriver: driverId || null,
          currentRoute: routeId || null,
        })
      );
      setReg("");
      await load();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  const toggle = async (cab: Cab) => {
    const next = cab.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await unwrap(api.put(`/api/cabs/${cab._id}`, { status: next }));
      await load();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cabs
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add cab
        </Typography>
        <Stack component="form" onSubmit={create} direction="row" flexWrap="wrap" gap={2}>
          <TextField
            label="Registration"
            value={reg}
            onChange={(e) => setReg(e.target.value)}
            required
            size="small"
          />
          <TextField
            label="Capacity"
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            size="small"
            type="number"
          />
          <TextField
            select
            label="Driver"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">—</MenuItem>
            {drivers.map((d) => (
              <MenuItem key={d._id} value={d._id}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Route"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">—</MenuItem>
            {routes.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" size="small">
            Save
          </Button>
        </Stack>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Reg</TableCell>
              <TableCell>Cap</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Route</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cabs.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.registrationNumber}</TableCell>
                <TableCell>{c.capacity}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  {typeof c.assignedDriver === "object" && c.assignedDriver
                    ? c.assignedDriver.name
                    : "—"}
                </TableCell>
                <TableCell>
                  {typeof c.currentRoute === "object" && c.currentRoute
                    ? c.currentRoute.name
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => toggle(c)}>
                    {c.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
