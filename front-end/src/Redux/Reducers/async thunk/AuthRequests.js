import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearErrors, setErrors } from "../errorSlice";
import { userLoaded, userLoading, setAuthenticated, logout } from "../authSlice";
import { setUser, unSetUser } from "../userSlice";
import axios from "axios";

export const loadUser = createAsyncThunk("user/loadUserStatus ", async (payload, thunkAPI) => {
	thunkAPI.dispatch(userLoading());

	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		const { data } = await axios.get("/api/auth/loaduser", config);

		if (data.success) {
			if (!data.user.isDeleted) {
				localStorage.setItem("userToken-team46", data.token);
				thunkAPI.dispatch(setAuthenticated(true));
				thunkAPI.dispatch(setUser(data.user));

				thunkAPI.dispatch(userLoaded());
			}

			return data;
		}
	} catch (error) {
		console.log(error.response.data.error);
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: 110 }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});

export const registerUser = createAsyncThunk("user/registerUserStatus ", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	const username = payload.username;
	const password = payload.password;
	const name = payload.name;
	try {
		const { data } = await axios.post("/api/auth/register", { username, password, name }, config);

		if (data.success) {
			return data;
		}
	} catch (error) {
		console.log(error.response.data.error);
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: 110 }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});

export const loginUser = createAsyncThunk("user/loginUserStatus ", async (payload, thunkAPI) => {
	thunkAPI.dispatch(userLoading());

	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};

	const username = payload.username;
	const password = payload.password;
	try {
		const { data } = await axios.post("/api/auth/login", { username, password }, config);

		if (data.success) {
			if (!data.user.isDeleted) {
				localStorage.setItem("userToken-team46", data.token);
				thunkAPI.dispatch(setAuthenticated(true));
				thunkAPI.dispatch(setUser(data.user));

				thunkAPI.dispatch(userLoaded());
			}

			return data;
		}
	} catch (error) {
		console.log(error.response.data.error);
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: 110 }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});

export const logoutUser = createAsyncThunk("user/logoutUserStatus ", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		const { data } = await axios.put("/api/auth/logout", {}, config);

		if (data.success) {
			thunkAPI.dispatch(logout());

			return data;
		}
	} catch (error) {
		console.log(error.response.data.error);
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: 110 }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});

export const deleteUser = createAsyncThunk("user/deleteUserStatus ", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		const { data } = await axios.put("/api/auth/deleteuser", {}, config);

		if (data.success) {
			return data;
		}
	} catch (error) {
		console.log(error.response.data.error);
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: 110 }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});
