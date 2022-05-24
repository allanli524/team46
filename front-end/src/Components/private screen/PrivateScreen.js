import "./PrivateScreen.css";
import React, { Component, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { loadUser } from "../../Redux/Reducers/async thunk/AuthRequests";
import { logout } from "../../Redux/Reducers/authSlice";

export class PrivateScreen extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let view = <div className="private-screen"></div>;
		if (this.props.loadingUser || this.props.authSlice.userLoading) {
			view = (
				<div className="private-screen">
					<div class="lds-ellipsis">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			);
		}

		return view;
	}
}

function mapStateToProps(state) {
	return {
		authSlice: state.authSlice,
		userSlice: state.userSlice,
		errorSlice: state.errorSlice,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		loadUser: () => dispatch(loadUser()),
		logout: () => dispatch(logout()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(function (props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	let loadingUser = false;
	useEffect(async () => {
		if (!localStorage.getItem("userToken-team46")) {
			console.log("send to landing");
			navigate("/landing");
		} else {
			loadingUser = true;

			const { payload } = await dispatch(loadUser());
			console.log(payload);

			if (!payload.user.isDeleted) {
				if (payload.user.isAdmin) {
					navigate("/admin");
				} else {
					navigate("/roomform");
				}
			} else {
				dispatch(logout());
				navigate("/landing");
			}
		}
	}, [dispatch, navigate]);

	return <PrivateScreen {...props} navigate={navigate} loadingUser={loadingUser} />;
});
