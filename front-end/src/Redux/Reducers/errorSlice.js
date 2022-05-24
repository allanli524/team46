import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
	name: "error",
	initialState: {
		msg: "",
		status: null,
		id: null,
	},
	reducers: {
		setErrors: (state, action) => {
			state.msg = action.payload.msg;
			state.status = action.payload.status;
			state.id = action.payload.id;
		},
		clearErrors: (state, action) => {
			state.msg = "";
			state.status = null;
			state.id = null;
		},
	},
});

export const { setErrors, clearErrors } = errorSlice.actions;

export default errorSlice.reducer;
