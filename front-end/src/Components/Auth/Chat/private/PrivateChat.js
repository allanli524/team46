import styles from "./PrivateChat.module.css";
import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Chat from "../Chat";
import { BiArrowFromRight } from "react-icons/bi";
import UserBanner from "../user banner/UserBanner";
import {
	joinPrivateRoom,
	joinRoom,
	leavePrivateRoom,
	leaveRoom,
} from "../../../../Redux/Reducers/async thunk/RoomRequests";
import { addParticipant, removeParticipant } from "../../../../Redux/Reducers/roomSlice";
import socket from "../../../../lib/socketio";

class PrivateChat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isPrivate: true,
			waiting: true,
			joined: false,
			userData: null,
		};

		this.exitChatRoom = this.exitChatRoom.bind(this);
		this.componentCleanup = this.componentCleanup.bind(this);
		this.onJoined = this.onJoined.bind(this);
		this.reset = this.reset.bind(this);
		this.setUserData = this.setUserData.bind(this);
	}

	componentCleanup() {
		// this will hold the cleanup code
		// whatever you want to do when the component is unmounted or page refreshes

		// exit from chat room when room is unmounted and not going to private chat
		this.exitChatRoom();
	}

	async componentDidMount() {
		this.setState({ joined: this.props.joined, userData: this.props.userData });
		window.addEventListener("beforeunload", this.componentCleanup);

		if (!this.props.waiting && !this.props.joined) {
			await this.onJoined();
		}

		if (socket) {
			const onJoined = this.onJoined;
			const reset = this.reset;
			const setUserData = this.setUserData;

			socket.on("joined private chat", function (data) {
				onJoined();
				//setWaiting(false);
			});

			socket.on("add participant", async function (data) {
				//addParticipant(data.content.participant);
			});

			socket.on("remove participant", function (data) {
				//removeParticipant(data.content.participant);
				reset();
				setUserData(data.content.participant);
			});
		}
	}

	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.componentCleanup); // remove the event handler for normal unmounting
	}

	reset = () => {
		this.setState({ waiting: true, joined: false });
	};

	setUserData = (participant) => {
		this.setState({ userData: participant });
	};

	exitChatRoom = async (event) => {
		// join prevRoom first then go back
		event.stopPropagation();
		const { prevRoom, roomSlice } = this.props;
		const tag = prevRoom.tag.toLowerCase();
		const alias = prevRoom.alias;

		if (roomSlice.tag) {
			const { payload } = await this.props.leaveRoom({ tag: roomSlice.tag.toLowerCase() });
			if (payload) {
				if (payload.success) {
					socket.emit("leave room", {
						success: payload.success,
						roomId: `${payload.room._id}`,
						participant: { userId: payload.userId, hash: payload.hash, userAlias: alias },
					});
				}
			}
		}

		const { payload } = await this.props.joinRoom({ tag, alias });
		if (payload) {
			if (payload.success) {
				socket.emit("join room", {
					success: payload.success,
					roomId: `${payload.room._id}`,
					participant: { userId: payload.userId, hash: payload.hash, userAlias: payload.alias },
				});
			}
		}

		if (!payload) {
			this.props.navigate("/roomform");
		}

		this.props.navigate(-1);
	};

	onJoined = async () => {
		const { prevRoom, userData } = this.props;

		const tag = prevRoom.tag.toLowerCase();
		const alias = prevRoom.alias;
		const { payload } = await this.props.joinPrivateRoom({ tag, alias, otherUserId: userData.userId });
		if (payload) {
			if (payload.success) {
				const user = {
					userId: payload.participant.userId,
					hash: payload.participant.hash,
					userName: payload.participant.name,
					userAlias: userData.userAlias,
				};
				socket.emit("join room", {
					success: payload.success,
					roomId: `${payload.room._id}`,
					participant: user,
				});

				await this.setState({ userData: user, joined: true });

				socket.emit("request update chat", { success: true });
			}
		}
	};

	render() {
		const { isPrivate, joined, userData } = this.state;

		return (
			<div className={styles.public_chat}>
				<div className={styles.chat_header}>
					<div className={styles.chat_header_leave} onClick={this.exitChatRoom}>
						Leave Chat
						<BiArrowFromRight className={styles.chat_exit_icon} />
					</div>
					<div className={styles.chat_title}>
						Private chat with @{userData ? (joined ? userData.userName : userData.userAlias) : null}
					</div>
				</div>
				<div className={styles.chat_wrapper}>
					<div className={styles.chat_side_panel}>
						<div className={styles.spacer} style={{ minHeight: "20px", width: "100%" }} />
						{userData ? (
							<UserBanner
								key={userData.userId}
								me={false}
								isPrivate={isPrivate}
								joined={joined}
								userData={userData}
							/>
						) : null}
						{/*!joined ? (
							<button onClick={() => this.setState({ waiting: false })}>
								Test button to simulate user joining
							</button>
						) : null*/}
					</div>
					<div className={styles.chat_view}>
						<Chat isPrivate={isPrivate} tag={joined ? this.props.roomSlice.tag : null} />
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		authSlice: state.authSlice,
		userSlice: state.userSlice,
		roomSlice: state.roomSlice,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		joinRoom: (data) => dispatch(joinRoom(data)),
		joinPrivateRoom: (data) => dispatch(joinPrivateRoom(data)),
		leavePrivateRoom: (data) => dispatch(leavePrivateRoom(data)),
		leaveRoom: (data) => dispatch(leaveRoom(data)),
		addParticipant: (data) => dispatch(addParticipant(data)),
		removeParticipant: (data) => dispatch(removeParticipant(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(function (props) {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { userData, prevRoom, joined, waiting } = state;

	useEffect(() => {
		if (!props.authSlice.isAuthenticated) {
			navigate("/login");
		}
	});

	return (
		<PrivateChat
			{...props}
			navigate={navigate}
			userData={userData}
			prevRoom={prevRoom}
			joined={joined}
			waiting={waiting}
		/>
	);
});
