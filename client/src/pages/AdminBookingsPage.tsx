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
import { format, parseISO } from "date-fns";
import { api, getApiErrorMessage, unwrap } from "../services/api";
import type { Booking, Cab, BookingStatus } from "../types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      if (status) params.status = status;
      const b = await unwrap<{ bookings: Booking[] }>(
        api.get("/api/bookings", { params })
      );
      setBookings(b.bookings);
      const c = await unwrap<{ cabs: Cab[] }>(api.get("/api/cabs"));
      setCabs(c.cabs);
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const reassign = async (bookingId: string, cabId: string) => {
    try {
      await unwrap(api.put(`/api/bookings/${bookingId}/reassign`, { cabId }));
      await load();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        All bookings
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            type="date"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            size="small"
          />
          <TextField
            type="date"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            size="small"
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus | "")}
            size="small"
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All</MenuItem>
            {(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const).map(
              (s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              )
            )}
          </TextField>
          <Button variant="outlined" size="small" onClick={() => void load()}>
            Apply filters
          </Button>
        </Stack>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cab</TableCell>
              <TableCell>Reassign</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => {
              const emp =
                typeof b.employee === "object" && b.employee
                  ? `${b.employee.name} (${b.employee.email})`
                  : "—";
              const cabLabel =
                typeof b.cab === "object" && b.cab
                  ? b.cab.registrationNumber
                  : "—";
              return (
                <TableRow key={b._id}>
                  <TableCell>{format(parseISO(b.date), "yyyy-MM-dd")}</TableCell>
                  <TableCell>{emp}</TableCell>
                  <TableCell>{b.timeSlot}</TableCell>
                  <TableCell>{b.status}</TableCell>
                  <TableCell>{cabLabel}</TableCell>
                  <TableCell>
                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                      <TextField
                        select
                        size="small"
                        defaultValue=""
                        sx={{ minWidth: 120 }}
                        onChange={(e) => {
                          if (e.target.value) reassign(b._id, e.target.value);
                        }}
                      >
                        <MenuItem value="">Pick cab…</MenuItem>
                        {cabs
                          .filter((c) => c.status === "ACTIVE")
                          .map((c) => (
                            <MenuItem key={c._id} value={c._id}>
                              {c.registrationNumber}
                            </MenuItem>
                          ))}
                      </TextField>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
