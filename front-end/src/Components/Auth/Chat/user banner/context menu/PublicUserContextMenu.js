import "./UserContextMenu.css";
import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { leaveRoom } from "../../../../../Redux/Reducers/async thunk/RoomRequests";
import { reportUser, clearReport } from "../../../../../Redux/Reducers/async thunk/UserRequests";
import socket from "../../../../../lib/socketio";

class PublicUserContextMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showReport: false,
		};

		this.handleInvite = this.handleInvite.bind(this);
		this.handleReportHover = this.handleReportHover.bind(this);
		this.reportName = this.reportName.bind(this);
		this.reportText = this.reportText.bind(this);
	}

	handleInvite = async (event) => {
		const { userData } = this.props;
		const { tag, alias } = this.props.roomSlice;
		const prevRoom = { tag, alias };

		const { payload } = await this.props.leaveRoom({ tag });
		if (payload) {
			if (payload.success) {
				socket.emit("leave room", {
					success: payload.success,
					roomId: `${payload.room._id}`,
					participant: { userId: payload.userId, hash: payload.hash, userAlias: "N/A" },
				});
				socket.emit("invite to private chat", {
					content: { success: payload.success, participant: { userId: payload.userId, userAlias: alias } },
					to: `${userData.userId}`,
				});
			}
		}
		console.log(userData);
		this.props.navigate("/prc", { state: { userData, prevRoom, waiting: true, joined: false } });
	};

	handleReportHover = (event) => {
		if (this.state.showReport) {
			this.setState({ showReport: false });
		} else {
			this.setState({ showReport: true });
		}
	};

	reportName = async (event) => {
		event.stopPropagation();
		this.setState({ showReport: false });
		const { userData } = this.props;

		const { payload } = await this.props.reportUser({
			reportedUserId: userData.userId,
			reportType: "NAME",
			reportedAlias: userData.userAlias,
		});
		console.log(payload);
	};

	reportText = async (event) => {
		event.stopPropagation();
		this.setState({ showReport: false });
		const { userData } = this.props;

		const { payload } = await this.props.reportUser({
			reportedUserId: userData.userId,
			reportType: "TEXT",
			reportedAlias: userData.userAlias,
		});
		console.log(payload);
	};

	render() {
		const x = `${this.props.x - 20}px`;
		const y = `${this.props.y}px`;

		return (
			<div className="user-context-menu" style={{ top: y, left: x }}>
				<div
					className="context-item"
					onMouseEnter={this.handleReportHover}
					onMouseLeave={this.handleReportHover}
				>
					Report
					<div className={`report-items ${this.state.showReport}`}>
						<div className="report-item" onClick={this.reportName}>
							Offensive name
						</div>
						<div className="report-item" onClick={this.reportText}>
							Abusive text
						</div>
					</div>
				</div>
				<div className="context-item" onClick={this.handleInvite}>
					Invite to Chat
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
		leaveRoom: (data) => dispatch(leaveRoom(data)),
		reportUser: (data) => dispatch(reportUser(data)),
		clearReport: (data) => dispatch(clearReport(data)),
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

	return <PublicUserContextMenu {...props} navigate={navigate} />;
});
