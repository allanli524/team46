import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
	name: "room",
	initialState: {
		alias: null,
		hash: null,
		tag: null,
		participants: null,
	},
	reducers: {
		setAlias: (state, action) => {
			state.alias = action.payload;
		},
		setTag: (state, action) => {
			state.tag = action.payload;
		},
		setRoom: (state, action) => {
			const roomData = action.payload;

			state.alias = roomData.alias;
			state.hash = roomData.hash;
			state.tag = roomData.tag;
			state.participants = roomData.participants;
		},
		unSetRoom: (state, action) => {
			state.alias = null;
			state.tag = null;
			state.hash = null;
			state.participants = null;
		},
		addParticipant: (state, action) => {
			let res = state.participants.filter((participant, index) => {
				return `${action.payload.userId}` === `${participant.userId}`;
			});

			if (res.length <= 0) {
				state.participants = [...state.participants, action.payload];
			}
		},
		removeParticipant: (state, action) => {
			state.participants = state.participants.filter((participant, index) => {
				return `${action.payload.userId}` !== `${participant.userId}`;
			});
		},
		setParticipants: (state, action) => {
			// blanket set all participants
			state.participants = action.payload;
		},
	},
});

export const { setAlias, setTag, setRoom, unSetRoom, addParticipant, removeParticipant, setParticipants } =
	roomSlice.actions;
export default roomSlice.reducer;
