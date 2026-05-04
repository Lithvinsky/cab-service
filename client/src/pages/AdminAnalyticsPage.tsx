import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api, getApiErrorMessage, unwrap } from "../services/api";

type Summary = {
  totalBookings: number;
  cancellations: number;
  bookingsPerDay: { date: string; total: number }[];
  utilizationPerCab: {
    registrationNumber: string;
    utilizationPct: number;
    bookings: number;
  }[];
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const from = format(subDays(new Date(), 30), "yyyy-MM-dd");
    const to = format(new Date(), "yyyy-MM-dd");
    void (async () => {
      try {
        const s = await unwrap<Summary>(
          api.get("/api/analytics/summary", { params: { from, to } })
        );
        setData(s);
      } catch (e) {
        setErr(getApiErrorMessage(e));
      }
    })();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Analytics (last 30 days)
      </Typography>
      {err && (
        <Typography color="error" sx={{ mb: 2 }}>
          {err}
        </Typography>
      )}
      {data && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total non-cancelled bookings: {data.totalBookings} · Cancellations
            (updated in range): {data.cancellations}
          </Typography>
          <Paper sx={{ p: 2, mb: 3, height: 360 }}>
            <Typography variant="subtitle2" gutterBottom>
              Bookings per day
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data.bookingsPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#1565c0" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
          <Paper sx={{ p: 2, height: 360 }}>
            <Typography variant="subtitle2" gutterBottom>
              Utilization % per cab (see README for definition)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={data.utilizationPerCab.map((u) => ({
                  cab: u.registrationNumber,
                  pct: u.utilizationPct,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cab" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="pct" fill="#00838f" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}
