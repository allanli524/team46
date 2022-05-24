import "./UserContextMenu.css";
import React, { Component } from "react";
import { useNavigate } from "react-router-dom";

class PrivateUserContextMenu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showReport: false,
		};

		this.handleReportHover = this.handleReportHover.bind(this);
	}

	handleReportHover = (event) => {
		if (this.state.showReport) {
			this.setState({ showReport: false });
		} else {
			this.setState({ showReport: true });
		}
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
						<div className="report-item">Offensive name</div>
						<div className="report-item">Abusive text</div>
					</div>
				</div>
			</div>
		);
	}
}

export default function (props) {
	const navigate = useNavigate();

	return <PrivateUserContextMenu {...props} navigate={navigate} />;
}
