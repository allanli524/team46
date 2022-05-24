import styles from "./Chat.module.css";
import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { IoSend } from "react-icons/io5";
import Message from "./Message";
import { useNavigate } from "react-router-dom";
import { getMessages, postMessage } from "../../../Redux/Reducers/async thunk/RoomRequests";
import socket from "../../../lib/socketio";

const userData1 = { alias: "A", name: "Allan" };
const userData2 = { alias: "H", name: "Hamid" };
const userData3 = { alias: "J", name: "Junaid" };
const userData4 = { alias: "W", name: "Wayne" };

class Chat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			message: "",
			messages: [],
		};

		this.handleText = this.handleText.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.addMessage = this.addMessage.bind(this);
		this.appendMessage = this.appendMessage.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.tag !== prevProps.tag) {
			console.log("update");
			this.loadMessages();
		}
	}

	async componentDidMount() {
		await this.loadMessages();

		if (socket) {
			const appendMessage = this.appendMessage;

			socket.on("receive message", function (data) {
				appendMessage(data.content.message);
			});
		}
	}

	handleText = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleKeyPress = (event) => {
		const keyCode = event.which || event.keyCode;

		if (keyCode === 13 && !event.shiftKey) {
			event.preventDefault();

			//submit message
			this.addMessage(this.state.message);
			this.setState({ message: "" });
		}
	};

	appendMessage = (message) => {
		let userData = { name: message.name, alias: message.name };

		this.setState({
			messages: [
				{
					_id: message._id,
					message: message.text,
					date: message.createdAt,
					userData: userData,
					isPrivate: message.isPrivateMessag,
				},
				...this.state.messages,
			],
		});
	};

	addMessage = async (message) => {
		const isPrivate = this.props.isPrivate;
		let userData = { name: this.props.userSlice.name, alias: this.props.roomSlice.alias };

		let name = this.props.userSlice.name;
		if (!isPrivate) {
			name = this.props.roomSlice.alias;
		}

		const new_message = {
			tag: this.props.roomSlice.tag,
			from: this.props.userSlice.username,
			name: name,
			isPrivateMessage: isPrivate,
			text: message,
		};
		const { payload } = await this.props.postMessage(new_message);
		if (payload) {
			if (payload.success) {
				socket.emit("send message", {
					content: { success: payload.success, message: payload.newMessage },
					to: `${payload.room._id}`,
				});
			}
		}

		this.setState({
			messages: [
				{
					_id: payload.newMessage._id,
					message: message,
					date: payload.newMessage.createdAt,
					userData: userData,
					isPrivate: isPrivate,
				},
				...this.state.messages,
			],
		});
	};

	loadMessages = async () => {
		console.log(this.props.tag);
		await this.setState({ messages: [] });
		const { isPrivate } = this.props;

		if (this.props.tag) {
			const { payload } = await this.props.getMessages({ tag: this.props.tag, offset: 0 });
			payload.messages.map((message) => {
				let userData = { name: message.name, alias: message.name };

				this.setState({
					messages: [
						...this.state.messages,
						{
							_id: message._id,
							message: message.text,
							date: message.createdAt,
							userData: userData,
							isPrivate: message.isPrivateMessag,
						},
					],
				});
			});
		} else {
			this.setState({ messages: [] });
		}
	};

	render() {
		return (
			<div className={styles.chat}>
				<div className={styles.chat_messages_container}>
					<div className={styles.chat_messages}>
						{this.state.messages.map((message) => {
							return (
								<Message
									key={message._id}
									_id={message._id}
									message={message.message}
									date={message.date}
									userData={message.userData}
									isPrivate={message.isPrivate}
								/>
							);
						})}
					</div>
				</div>
				<div className={styles.chat_input_wrapper}>
					<textarea
						placeholder="Message #(chat name)"
						className={styles.chat_input}
						maxLength={200}
						onChange={this.handleText}
						onKeyDown={this.handleKeyPress}
						name="message"
						value={this.state.message}
					/>
					<div className={styles.chat_input_button}>
						<IoSend className={styles.chat_input_button_icon} />
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
		getMessages: (data) => dispatch(getMessages(data)),
		postMessage: (data) => dispatch(postMessage(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(function (props) {
	const navigate = useNavigate();

	return <Chat {...props} navigate={navigate} />;
});
