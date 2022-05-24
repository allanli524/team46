import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearErrors, setErrors } from "../errorSlice";
import axios from "axios";

export const getUser = createAsyncThunk("user/getUser", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		const { data } = await axios.get(`/api/user/getprofile/${payload}`, config);
		// console.log(data.success);
		if (data.success) {
			return data.user;
		}
	} catch (error) {
		console.log(error.response.data.error);
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: 110 }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});

export const setUser = createAsyncThunk("user/setUser", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		const { data } = await axios.post("/api/user/setprofile", payload, config);
		// console.log(data.success);
		if (data.success) {
			console.log(data);
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

export const reportUser = createAsyncThunk("user/reportUserStatus", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	const { reportedUserId, reportType, reportedAlias } = payload;
	try {
		const { data } = await axios.post(
			`/api/user/reportuser`,
			{ reportedUserId, reportType, reportedAlias },
			config
		);
		// console.log(data.success);
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

export const clearReport = createAsyncThunk("user/clearReportStatus", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	const { reportId, reportedUserId } = payload;
	try {
		const { data } = await axios.post(`/api/admin/clearreport`, { reportId, reportedUserId }, config);
		// console.log(data.success);
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

export const getReport = createAsyncThunk("user/getReportStatus", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		const { data } = await axios.post(`/api/admin/getreport`, config);
		// console.log(data.success);
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

export const getLastMessage = createAsyncThunk("user/getLastMessageStatus", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		const { data } = await axios.get(`/api/user/getlastmessage/${payload.userId}`, config);
		// console.log(data.success);
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
