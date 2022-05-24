import styles from "./UserBanner.module.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FaBars } from "react-icons/fa";
import PublicUserContextMenu from "./context menu/PublicUserContextMenu";
import PrivateUserContextMenu from "./context menu/PrivateUserContextMenu";
import { useNavigate } from "react-router-dom";
import { getLastMessage } from "../../../../Redux/Reducers/async thunk/UserRequests";
import { getProfilePic } from "../../../Utils/ProfilePic";

class UserBanner extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showMenu: false,
			clientX: 0,
			clientY: 0,
			joined: false,
			message: null,
		};

		this._mounted = false;
		this.handleMenu = this.handleMenu.bind(this);
		this.handleMenuExit = this.handleMenuExit.bind(this);
		this.getMouseLocation = this.getMouseLocation.bind(this);
		this.getMessage = this.getMessage.bind(this);
	}

	async componentDidMount() {
		await this.getMessage();
		this._mounted = true;
	}

	handleMenu = () => {
		console.log("clicked");
		if (!this.props.me) {
			console.log(this.state.userData);
			this.setState({ showMenu: true });
		}
	};

	getMouseLocation = (event) => {
		this.setState({ clientX: event.clientX, clientY: event.clientY });

		console.log(event.clientX + " " + event.clientY);
	};

	handleMenuExit = () => {
		this.setState({ showMenu: false });
	};

	getMessage = async () => {
		const { payload } = await this.props.getLastMessage({ userId: this.props.userData.userId });

		if (payload.message.length <= 0) {
			this.setState({ message: "no last message" });
		} else {
			this.setState({ message: payload.message[0].text });
		}
	};

	render() {
		const { userData, isPrivate, joined } = this.props;
		let name = "filler";
		if (isPrivate ? (joined ? userData.userName : userData.userAlias) : userData.userAlias) {
			name = isPrivate ? (joined ? userData.userName : userData.userAlias) : userData.userAlias;
		}

		return (
			<div className={styles.user_banner} onMouseLeave={this.handleMenuExit}>
				<div className={styles.profile_img}>
					<div className={styles.profile_name}> {getProfilePic(name, 48)}</div>
					{/*<img src={require("./profile_picture.png")} />*/}
				</div>
				<div className={styles.user_container} onClick={this.handleMenu} onMouseDown={this.getMouseLocation}>
					<div className={styles.user_title}>
						{isPrivate ? (joined ? userData.userName : userData.userAlias) : userData.userAlias}
					</div>
					<div className={styles.user_last_message}>
						{isPrivate ? (
							joined ? (
								this.state.message
							) : (
								<div className={styles.waiting}>Waiting ...</div>
							)
						) : (
							this.state.message
						)}
					</div>
				</div>
				{/*this.props.me ? null : <FaBars className={styles.banner_menu_icon} />*/}
				{this.state.showMenu ? (
					<div>
						{isPrivate ? null : (
							<PublicUserContextMenu x={this.state.clientX} y={this.state.clientY} userData={userData} />
						)}
					</div>
				) : null}
			</div>
		);
	}
}
/*<PrivateUserContextMenu x={this.state.clientX} y={this.state.clientY} userData={userData} />*/

function mapStateToProps(state) {
	return {
		authSlice: state.authSlice,
		userSlice: state.userSlice,
		roomSlice: state.roomSlice,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		getLastMessage: (data) => dispatch(getLastMessage(data)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(function (props) {
	const navigate = useNavigate();

	return <UserBanner {...props} navigate={navigate} />;
});
