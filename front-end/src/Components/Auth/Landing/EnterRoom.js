import styles from "./EnterRoom.module.css";
import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRoom } from "../../../Redux/Reducers/roomSlice";
import { IoLogOut, IoPersonCircleSharp } from "react-icons/io5";
import { unSetUser } from "../../../Redux/Reducers/userSlice";
import { logout } from "../../../Redux/Reducers/authSlice";
import { logoutUser } from "../../../Redux/Reducers/async thunk/AuthRequests";
import { joinRoom } from "../../../Redux/Reducers/async thunk/RoomRequests";
import socket from "../../../lib/socketio";
import io from "socket.io-client";

class EnterRoom extends Component {
	constructor(props) {
		super(props);

		this.state = {
			alias: "",
			roomTag: "",
		};

		this.server = null;

		this.handleText = this.handleText.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.openSettings = this.openSettings.bind(this);
	}

	componentDidMount() {
		if (socket) {
			/*socket.on("add participant", function (data) {
				this.props.addParticipant(data.content.participant);
			});*/
		}
	}

	handleText = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		const tag = this.state.roomTag.toLowerCase();
		const alias = this.state.alias;
		const { payload } = await this.props.joinRoom({ tag, alias });
		console.log(payload);

		if (payload) {
			if (payload.success) {
				socket.emit("join room", {
					success: payload.success,
					roomId: `${payload.room._id}`,
					participant: { userId: payload.userId, hash: payload.hash, userAlias: payload.alias },
				});

				this.props.navigate("/pc");
			} else {
				this.setState({ alias: "", roomTag: "" });
			}
		} else {
			this.setState({ alias: "", roomTag: "" });
		}
	};

	handleLogout = async (event) => {
		await this.props.logoutUser();
		this.props.navigate("/");
	};

	openSettings = (event) => {
		this.props.navigate("/settings");
	};

	render() {
		let error = null;
		if (this.props.errorSlice.id === 101) {
			error = this.props.errorSlice.msg;
		}

		return (
			<div className={styles.body}>
				{/* <div className={styles.enter_room}> */}
				<div className={styles.enter_room_header}>
					<div className={styles.logout} onClick={this.handleLogout}>
						Log Out
						<IoLogOut className={styles.enter_room_header_item} />
					</div>
					<div className={styles.profile} onClick={this.openSettings}>
						Settings
						<IoPersonCircleSharp className={styles.enter_room_header_item} />
					</div>
				</div>
				<div className={styles.enter_room_content_wrapper}>
					<form className={styles.enter_room} onSubmit={this.handleSubmit}>
						<div style={{ color: "red" }}>{error ? `*${error}` : null}</div>
						<div className={styles.form_title}>Join a Chat Room</div>
						<div className={styles.form_description}>Join a room and chat with like-minded people</div>
						<input
							type="text"
							id={styles.alias_input}
							name="alias"
							value={this.state.alias}
							placeholder="Your name..."
							required={true}
							onChange={this.handleText}
						/>
						<input
							type="text"
							id={styles.room_tag_input}
							name="roomTag"
							value={this.state.roomTag}
							placeholder="Your interest..."
							required={true}
							onChange={this.handleText}
						/>
						<button type="submit" id={styles.join_room_submit}>
							Join
						</button>
					</form>
				</div>
				{/* </div> */}
			</div>
		);
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
		setRoom: (room) => dispatch(setRoom(room)),
		unSetUser: () => dispatch(unSetUser()),
		logout: () => dispatch(logout()),
		logoutUser: () => dispatch(logoutUser()),
		joinRoom: (data) => dispatch(joinRoom(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(function (props) {
	const navigate = useNavigate();

	useEffect(() => {
		if (!props.authSlice.isAuthenticated) {
			navigate("/login");
		}
	});

	return <EnterRoom {...props} navigate={navigate} />;
});
