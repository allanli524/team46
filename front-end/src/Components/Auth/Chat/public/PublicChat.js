import styles from "./PublicChat.module.css";
import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import Chat from "../Chat";
import { ImExit } from "react-icons/im";
import UserBanner from "../user banner/UserBanner";
import { useNavigate } from "react-router-dom";
import { leaveRoom } from "../../../../Redux/Reducers/async thunk/RoomRequests";
import { setParticipants, addParticipant, removeParticipant } from "../../../../Redux/Reducers/roomSlice";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import socket from "../../../../lib/socketio";

const userData1 = { userAlias: "ABCDEFGHIJ", hash: "123456", userName: "Allan" };
const userData2 = { userAlias: "H", hash: "123456", userName: "Hamid" };
const userData3 = { userAlias: "J", hash: "123456", userName: "Junaid" };
const userData4 = { userAlias: "W", hash: "123456", userName: "Wayne" };

class PublicChat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isPrivate: false,
			invites: [
				{
					userAlias: "testj2alias",
					userId: "624a4a1ab9bc276f88e2a8e2",
				},
				{
					userAlias: "testj1alias",
					userId: "624a49b77883af97ac8f7069",
				},
			],
			inviteIndex: 0,
		};

		this.exitChatRoom = this.exitChatRoom.bind(this);
		this.addInvite = this.addInvite.bind(this);
		this.removeInvite = this.removeInvite.bind(this);
		this.incrementIndex = this.incrementIndex.bind(this);
		this.decrementIndex = this.decrementIndex.bind(this);
		this.acceptInvite = this.acceptInvite.bind(this);
		this.declineInvite = this.declineInvite.bind(this);
		this.componentCleanup = this.componentCleanup.bind(this);
	}

	async componentCleanup() {
		// this will hold the cleanup code
		// whatever you want to do when the component is unmounted or page refreshes

		// exit from chat room when room is unmounted and not going to private chat
		if (this.props.roomSlice.tag) {
			await this.exitChatRoom();
		}
	}

	componentDidMount() {
		window.addEventListener("beforeunload", this.componentCleanup);

		if (socket) {
			const { alias } = this.props.roomSlice;
			const addParticipant = this.props.addParticipant;
			const removeParticipant = this.props.removeParticipant;
			const addInvite = this.addInvite;

			socket.on("add participant", async function (data) {
				if (data.content.participant.userAlias !== alias) {
					console.log("add participant:");
					console.log(data);
					console.log(data.content.participant);
					addParticipant(data.content.participant);
					console.log("----------------------------------");
				}
			});

			socket.on("remove participant", function (data) {
				//addMessage(data.content.message);
				if (data.content.participant.userAlias !== alias) {
					removeParticipant(data.content.participant);
				}
			});

			socket.on("receive invite", function (data) {
				//addMessage(data.content.message);
				if (data.content.participant.userAlias !== alias) {
					console.log("add invite:");
					console.log(data);
					console.log(data.content.participant);
					addInvite(data.content.participant);
					console.log("----------------------------------");
				}
			});
		}
	}

	componentWillUnmount() {
		window.removeEventListener("beforeunload", this.componentCleanup); // remove the event handler for normal unmounting
	}

	exitChatRoom = async (event) => {
		const { tag } = this.props.roomSlice;

		const { payload } = await this.props.leaveRoom({ tag });
		if (payload) {
			if (payload.success) {
				socket.emit("leave room", {
					success: payload.success,
					roomId: `${payload.room._id}`,
					participant: { userId: payload.userId, hash: payload.hash, userAlias: "N/A" },
				});
			}
		}

		this.props.navigate("/roomform");
	};

	addInvite = (participant) => {
		const invite = { userAlias: participant.userAlias, userId: participant.userId };
		this.setState({ invites: [invite, ...this.state.invites], invited: true });
		// console.log(this.state.invites);
	};

	removeInvite = async (event) => {
		const currIndex = this.state.inviteIndex;

		this.setState({
			invites: this.state.invites.filter(function (invite, index) {
				return `${index}` !== `${currIndex}`;
			}),
		});

		if (this.state.invites.length === currIndex + 1) {
			await this.setState({ inviteIndex: this.state.inviteIndex - 1 });
		}
	};

	incrementIndex = async (event) => {
		if (this.state.invites.length === this.state.inviteIndex + 1) {
			//console.log("reset");
			await this.setState({ inviteIndex: 0 });
		} else {
			//console.log("increment");
			await this.setState({ inviteIndex: this.state.inviteIndex + 1 });
		}
	};

	decrementIndex = async (event) => {
		if (this.state.inviteIndex === 0) {
			//console.log("last");
			await this.setState({ inviteIndex: this.state.invites.length - 1 });
		} else {
			//console.log("decrement");
			await this.setState({ inviteIndex: this.state.inviteIndex - 1 });
		}
	};

	acceptInvite = async (event) => {
		console.log("accept invite");
		// accept and move into private chat with the userId+yourUserId+roomtag and send accepted to socket
		const { tag, alias } = this.props.roomSlice;
		const userData = this.state.invites[this.state.inviteIndex];
		const prevRoom = { tag, alias };

		this.removeInvite();

		const { payload } = await this.props.leaveRoom({ tag });
		if (payload) {
			if (payload.success) {
				socket.emit("leave room", {
					success: payload.success,
					roomId: `${payload.room._id}`,
					participant: { userId: payload.userId, hash: payload.hash, userAlias: "N/A" },
				});
				socket.emit("accept invite", {
					content: { success: payload.success, participant: { userId: payload.userId, userAlias: alias } },
					to: `${userData.userId}`,
				});
			}
		}
		// console.log(userData, payload, this.props);
		//socket.emit("accept-private-chat", { ...userData, participants: this.props.roomSlice.participants });

		this.props.navigate("/prc", { state: { userData, prevRoom, waiting: false, joined: false } });
	};

	declineInvite = (event) => {
		console.log("decline invite");
		// decline send declined to socket
		this.removeInvite();
	};

	render() {
		const isPrivate = this.state.isPrivate;
		// console.log(this.props.roomSlice);
		const { tag, alias, hash, participants } = this.props.roomSlice;

		let component = null;
		if (this.state.invites.length > 0) {
			component = (
				<div className={`${styles.chat_invites} ${this.state.invited}`}>
					<div
						className={styles.remove_invite}
						id={this.state.invites[this.state.inviteIndex].userId}
						onClick={this.removeInvite}
					>
						<IoClose
							className={styles.remove_invite_icon}
							id={this.state.invites[this.state.inviteIndex].userId}
						/>
					</div>
					<div className={styles.invite_alias}>{this.state.invites[this.state.inviteIndex].userAlias}</div>
					<div className={styles.invite_menu}>
						<div className={styles.accept_invite} onClick={this.acceptInvite}>
							Accept
						</div>
						<div className={styles.decline_invite} onClick={this.declineInvite}>
							Decline
						</div>
					</div>
					{this.state.invites.length > 1 ? (
						<div className={styles.cycle_invites}>
							<IoChevronBack className={styles.cycle_back} onClick={this.decrementIndex} />
							<IoChevronForward className={styles.cycle_forward} onClick={this.incrementIndex} />
						</div>
					) : null}
				</div>
			);
		}

		return (
			<div className={styles.public_chat}>
				<div className={styles.chat_header}>
					<div className={styles.chat_header_leave} onClick={this.exitChatRoom}>
						Leave Room
						<ImExit className={styles.chat_exit_icon} onClick={this.exitChatRoom} />
					</div>
					<div className={styles.chat_title}>
						{alias} welcome to @{tag}
					</div>
				</div>
				<div className={styles.chat_wrapper}>
					<div className={styles.chat_side_panel}>
						{component}
						{participants.map((participant) => (
							<UserBanner
								key={participant.userId}
								me={false}
								isPrivate={isPrivate}
								userData={participant}
							/>
						))}
						<UserBanner
							key={"624a4a1ab9bc276f88e2a8e2"}
							me={false}
							isPrivate={isPrivate}
							userData={{
								userId: "624a4a1ab9bc276f88e2a8e2",
								hash: "624a4a",
								userName: "Testj2",
								userAlias: "testj2alias",
							}}
						/>
						<UserBanner
							key={"624a49b77883af97ac8f7069"}
							me={false}
							isPrivate={isPrivate}
							userData={{
								userId: "624a49b77883af97ac8f7069",
								hash: "624a49",
								userName: "Testj1",
								userAlias: "testj1alias",
							}}
						/>
					</div>
					<div className={styles.chat_view}>
						<Chat isPrivate={isPrivate} tag={this.props.roomSlice.tag} />
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
		leaveRoom: (room) => dispatch(leaveRoom(room)),
		setParticipants: (participants) => dispatch(setParticipants(participants)),
		addParticipant: (participants) => dispatch(addParticipant(participants)),
		removeParticipant: (participants) => dispatch(removeParticipant(participants)),
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

	return <PublicChat {...props} navigate={navigate} />;
});
