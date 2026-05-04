import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";

type AuthState = {
  user: User | null;
  token: string | null;
};

const token = localStorage.getItem("cab_token");

const initialState: AuthState = {
  user: null,
  token: token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("cab_token", action.payload.token);
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("cab_token");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
