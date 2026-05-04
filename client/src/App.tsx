import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { api, unwrap } from "./services/api";
import { useAppDispatch, useAppSelector } from "./hooks";
import { setUser, logout } from "./store/authSlice";
import { AppLayout } from "./components/AppLayout";
import { PrivateRoute } from "./components/PrivateRoute";
import type { User } from "./types";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeBookingsPage from "./pages/EmployeeBookingsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCabsPage from "./pages/AdminCabsPage";
import AdminDriversPage from "./pages/AdminDriversPage";
import AdminRoutesPage from "./pages/AdminRoutesPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);

  useEffect(() => {
    if (!token) return;
    void (async () => {
      try {
        const res = await unwrap<{ user: User }>(api.get("/api/auth/me"));
        dispatch(setUser(res.user));
      } catch {
        dispatch(logout());
      }
    })();
  }, [token, dispatch]);

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={<Navigate to="/app" replace />}
        />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="bookings" element={<EmployeeBookingsPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cabs" element={<AdminCabsPage />} />
          <Route path="drivers" element={<AdminDriversPage />} />
          <Route path="routes" element={<AdminRoutesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthBootstrap>
  );
}
