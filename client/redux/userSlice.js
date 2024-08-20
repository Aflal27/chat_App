import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
      state.name = action.payload.name;
    },
    logout: (state, action) => {
      state._id = "";
      state.email = "";
      state.profile_pic = "";
      state.name = "";
      state.token = "";
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});
export const { setToken, setUser, logout, setOnlineUser, setSocketConnection } =
  userSlice.actions;
export default userSlice.reducer;
