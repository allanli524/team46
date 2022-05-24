//import { createStore, applyMiddleware, compose } from "redux";
//import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Reducers/userSlice";
import errorSlice from "./Reducers/errorSlice";
import authSlice from "./Reducers/authSlice";
import roomSlice from "./Reducers/roomSlice";

const initialState = {};

//, window.REDUX_DEVTOOLS_EXTENSION && window.REDUX_DEVTOOLS_EXTENSION()
/*compose(
	applyMiddleware(...middleware),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
const middleware = [thunk];*/

const store = configureStore({
	reducer: {
		authSlice,
		errorSlice,
		userSlice,
		roomSlice,
	},
	initialState,
});

export default store;
