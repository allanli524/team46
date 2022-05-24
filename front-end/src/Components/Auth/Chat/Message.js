import styles from "./Message.module.css";
import React, { Component } from "react";
import { getProfilePic } from "../../Utils/ProfilePic";

export default class Message extends Component {
	constructor(props) {
		super(props);
		this.state = {
			_id: this.props.id,
		};
	}

	formatter = new Intl.DateTimeFormat("en-GB", {
		year: "2-digit",
		month: "short",
		day: "numeric",
		hourCycle: "h12",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});

	render() {
		const { userData } = this.props;

		// hardcoded temporarily
		if (!userData.name) userData.name = "Me";
		if (!userData.alias) userData.alias = "Me";

		return (
			<div className={styles.message}>
				<div className={styles.profile_img}>
					{getProfilePic(this.props.isPrivate ? userData.name : userData.alias, 48)}
					{/*<img src={require("./profile_picture.png")} />*/}
				</div>

				<div className={styles.message_container}>
					<div className={styles.header}>
						<div className={styles.header_sender}>
							{this.props.isPrivate ? userData.name : userData.alias}&nbsp;
						</div>
						<div className={styles.header_time}>{this.formatter.format(new Date(this.props.date))}</div>
					</div>
					<div className={styles.message_text}>{this.props.message}</div>
				</div>
			</div>
		);
	}
}
