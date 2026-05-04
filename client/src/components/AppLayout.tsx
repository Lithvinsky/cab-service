import {
  AppBar,
  Box,
  Button,
  Container,
  SvgIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import type { SvgIconProps } from "@mui/material";

function TaxiIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </SvgIcon>
  );
}
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../store/authSlice";

export function AppLayout() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0} color="primary">
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <TaxiIcon sx={{ mr: 0.5 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Corporate Cab Booking
          </Typography>
          {user && (
            <>
              <Button color="inherit" component={RouterLink} to="/app">
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/app/bookings">
                My bookings
              </Button>
              {user.role === "ADMIN" && (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin">
                    Admin
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/admin/cabs">
                    Cabs
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/drivers"
                  >
                    Drivers
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/routes"
                  >
                    Routes
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/bookings"
                  >
                    All bookings
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin/analytics"
                  >
                    Analytics
                  </Button>
                </>
              )}
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
