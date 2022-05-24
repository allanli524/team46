import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, useLocation, Navigate } from "react-router-dom";

const PrivateRoute = ({ children: children, ...rest }) => {
	let location = useLocation();
	const state = useSelector((state) => state);

	if (!localStorage.getItem("userToken-team46") || !state.authSlice.isAuthenticated) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	return children;
};

export default PrivateRoute;
