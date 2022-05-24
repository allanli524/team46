import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearErrors, setErrors } from "../errorSlice";
import { setRoom, unSetRoom, setTag } from "../roomSlice";
import axios from "axios";

export const joinRoom = createAsyncThunk("room/joinRoomStatus ", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	const tag = payload.tag;
	const alias = payload.alias;
	try {
		const { data } = await axios.post("/api/room/joinroom", { tag, alias }, config);

		if (data.success) {
			const room = data.room;
			thunkAPI.dispatch(
				setRoom({ tag: room.tag, alias: data.alias, hash: data.hash, participants: data.participants })
			);

			return data;
		}
	} catch (error) {
		console.log(error.response.data.error);
		let id = 0;
		if (error.response.data.error === "Room has been blocked.") {
			id = 101;
		}
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: id }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});

export const joinPrivateRoom = createAsyncThunk("room/joinPrivateRoomStatus ", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	const tag = payload.tag;
	const alias = payload.alias;
	const otherUserId = payload.otherUserId;
	try {
		const { data } = await axios.post("/api/room/joinprivateroom", { tag, alias, otherUserId }, config);

		if (data.success) {
			const room = data.room;
			thunkAPI.dispatch(
				setRoom({ tag: room.tag, alias: data.alias, hash: data.hash, participants: [data.participant] })
			);

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

export const leaveRoom = createAsyncThunk("room/leaveRoomStatus ", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	const tag = payload.tag;
	try {
		const { data } = await axios.post("/api/room/leaveroom", { tag }, config);

		if (data.success) {
			//thunkAPI.dispatch(unSetRoom());

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

export const leavePrivateRoom = createAsyncThunk("room/leavePrivateRoomStatus ", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	const tag = payload.tag;
	const otherUserId = payload.otherUserId;
	try {
		const { data } = await axios.post("/api/room/leaveprivateroom", { tag, otherUserId }, config);

		if (data.success) {
			//thunkAPI.dispatch(unSetRoom());

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

export const postMessage = createAsyncThunk("room/postMessage", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		// console.log(data);
		const { data } = await axios.post("api/room/addmessage", payload, config);
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

export const getMessages = createAsyncThunk("room/getMessages", async (payload, thunkAPI) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + localStorage.getItem("userToken-team46"),
		},
	};

	try {
		// console.log(data);
		const { data } = await axios.get(`api/room/getmessages/${payload.tag}/${payload.offset}`, config);
		console.log(data);

		if (data.success) {
			return data;
		}
	} catch (error) {
		console.log(error.response.data.error);
		thunkAPI.dispatch(setErrors({ msg: error.response.data.error, status: 404, id: 0 }));
		setTimeout(() => {
			thunkAPI.dispatch(clearErrors());
		}, 5000);
	}
});
