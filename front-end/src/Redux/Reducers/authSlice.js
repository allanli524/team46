import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: localStorage.getItem("userToken-team46"),
		isAuthenticated: null,
		userLoading: false,
	},
	reducers: {
		userLoading: (state, action) => {
			state.userLoading = true;
		},
		userLoaded: (state, action) => {
			state.userLoading = false;
		},
		setAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload;
		},
		logout: (state, action) => {
			state.token = null;
			localStorage.removeItem("userToken-team46");
			state.isAuthenticated = false;
		},
	},
});

export const { userLoading, userLoaded, setAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;
