import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { api, getApiErrorMessage, unwrap } from "../services/api";
import type { Booking, RouteDoc, TimeSlot } from "../types";

export default function EmployeeDashboard() {
  const [routes, setRoutes] = useState<RouteDoc[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [routeId, setRouteId] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("Corporate HQ");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [slot, setSlot] = useState<TimeSlot>("MORNING");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const load = async () => {
    try {
      const [r, b] = await Promise.all([
        unwrap<{ routes: RouteDoc[] }>(api.get("/api/routes")),
        unwrap<{ bookings: Booking[] }>(api.get("/api/bookings/my")),
      ]);
      setRoutes(r.routes);
      setBookings(b.bookings);
      if (!routeId && r.routes[0]) setRouteId(r.routes[0]._id);
    } catch (e) {
      setMsg({ type: "err", text: getApiErrorMessage(e) });
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await unwrap<{ booking: Booking }>(
        api.post("/api/bookings", {
          route: routeId,
          pickupLocation: pickup,
          dropLocation: drop,
          date,
          timeSlot: slot,
        })
      );
      setMsg({
        type: "ok",
        text:
          res.booking.status === "CONFIRMED"
            ? "Booking confirmed — cab assigned."
            : "Booking created — pending cab assignment.",
      });
      await load();
    } catch (err) {
      setMsg({ type: "err", text: getApiErrorMessage(err) });
    }
  };

  const upcoming = bookings.filter(
    (b) =>
      b.status !== "CANCELLED" &&
      b.status !== "COMPLETED" &&
      new Date(b.date) >= new Date(new Date().toDateString())
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Employee dashboard</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            New booking
          </Typography>
          {msg && (
            <Alert severity={msg.type === "ok" ? "success" : "error"} sx={{ mb: 2 }}>
              {msg.text}
            </Alert>
          )}
          <Box component="form" onSubmit={submit}>
            <Stack spacing={2} maxWidth={480}>
              <TextField
                select
                label="Route / zone"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                required
              >
                {routes.map((r) => (
                  <MenuItem key={r._id} value={r._id}>
                    {r.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
                helperText="Building, gate, or landmark"
              />
              <TextField
                label="Drop location"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                required
              />
              <TextField
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <TextField
                select
                label="Time slot"
                value={slot}
                onChange={(e) => setSlot(e.target.value as TimeSlot)}
              >
                <MenuItem value="MORNING">Morning</MenuItem>
                <MenuItem value="EVENING">Evening</MenuItem>
              </TextField>
              <Button type="submit" variant="contained">
                Request cab
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upcoming bookings
          </Typography>
          {upcoming.length === 0 ? (
            <Typography color="text.secondary">None scheduled.</Typography>
          ) : (
            <Stack spacing={1}>
              {upcoming.slice(0, 5).map((b) => (
                <Box
                  key={b._id}
                  sx={{
                    p: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    {format(parseISO(b.date), "MMM d, yyyy")} · {b.timeSlot} ·{" "}
                    {b.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {b.pickupLocation} → {b.dropLocation}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
