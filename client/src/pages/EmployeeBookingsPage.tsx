import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { api, getApiErrorMessage, unwrap } from "../services/api";
import type { Booking } from "../types";

export default function EmployeeBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const { bookings: b } = await unwrap<{ bookings: Booking[] }>(
        api.get("/api/bookings/my")
      );
      setBookings(b);
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const cancel = async (id: string) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await unwrap(api.put(`/api/bookings/${id}/cancel`));
      await load();
    } catch (e) {
      setErr(getApiErrorMessage(e));
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My bookings
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Pickup → Drop</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => {
              const route =
                typeof b.route === "object" && b.route
                  ? b.route.name
                  : "—";
              return (
                <TableRow key={b._id}>
                  <TableCell>
                    {format(parseISO(b.date), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{b.timeSlot}</TableCell>
                  <TableCell>{route}</TableCell>
                  <TableCell>
                    {b.pickupLocation} → {b.dropLocation}
                  </TableCell>
                  <TableCell>
                    <Chip label={b.status} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                      <Button size="small" onClick={() => cancel(b._id)}>
                        Cancel
                      </Button>
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
