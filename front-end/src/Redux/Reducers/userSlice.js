import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "user",
	initialState: {
		users: [
			{ username: "Tag", password: "csc309", name: "Junaid", age: "22", bio: "just a guy" },
			{ username: "Minfan", password: "TA", name: "Minfan", age: "22", bio: "The ta" },
			{ username: "admin", password: "admin", name: "admin", age: "0", bio: "admin" },
		],
		username: null,
		name: null,
		age: null,
		bio: null,
		profilePic: null,
	},
	reducers: {
		setUsername: (state, action) => {
			state.username = action.payload;
		},
		setName: (state, action) => {
			state.name = action.payload;
		},
		setAge: (state, action) => {
			state.age = action.payload;
		},
		setBio: (state, action) => {
			state.bio = action.payload;
		},
		setUser: (state, action) => {
			const user = action.payload;

			state.username = user.username;
			state.name = user.name;
			user.age <= 0 ? (state.age = null) : (state.age = user.age);
			state.bio = user.bio;
			user.profilePic === "N/A" ? (state.profilePic = null) : (state.profilePic = user.profilePic);
		},
		addUser: (state, action) => {
			const user = action.payload;

			state.users.push(user);
		},
		unSetUser: (state, action) => {
			state.username = null;
			state.name = null;
			state.age = null;
			state.bio = null;
			state.profilePic = null;
		},
	},
});

export const { setUsername, setName, setAge, setBio, setUser, addUser, unSetUser } = userSlice.actions;
export default userSlice.reducer;
