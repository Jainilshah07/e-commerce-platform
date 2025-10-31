import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: null,
  token: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.users = action.payload.users;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.users = null;
      state.token = null;
      // localStorage.clear(); // optional
    },
  },
});

export const { loginSuccess, logout, restoreSession } = usersSlice.actions;
export default usersSlice.reducer;
