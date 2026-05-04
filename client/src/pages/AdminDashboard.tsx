import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { api, getApiErrorMessage, unwrap } from "../services/api";

type Summary = {
  totalBookings: number;
  cancellations: number;
  bookingsPerDay: { date: string; total: number }[];
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const from = format(subDays(new Date(), 7), "yyyy-MM-dd");
    const to = format(new Date(), "yyyy-MM-dd");
    void (async () => {
      try {
        const data = await unwrap<Summary>(
          api.get("/api/analytics/summary", { params: { from, to } })
        );
        setSummary(data);
      } catch (e) {
        setErr(getApiErrorMessage(e));
      }
    })();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin overview
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      {summary && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Active bookings (range)</Typography>
                <Typography variant="h4">{summary.totalBookings}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Cancellations (range)</Typography>
                <Typography variant="h4">{summary.cancellations}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Last 7 days data points</Typography>
                <Typography variant="h4">{summary.bookingsPerDay.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Use Analytics for charts. Manage fleet and bookings from the navigation bar.
      </Typography>
    </Box>
  );
}
