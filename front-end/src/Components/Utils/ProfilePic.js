import React from "react";

export const getProfilePic = (name, size) => {
	// console.log(name);

	const getInitials = () => {
		if (name.trim() == "") {
			return ";_;";
		}
		name = name.toUpperCase().trim();
		const split_name_raw = name.split(" ");
		let split_name = [];
		let i = 0;
		for (i; i < split_name_raw.length; i++) {
			if (split_name_raw[i]) {
				split_name.push(split_name_raw[i]);
			}
		}
		if (split_name.length < 2) {
			if (split_name[0].length < 2) {
				return name[0];
			} else {
				return name[0] + name[1];
			}
		} else {
			return split_name[0][0] + split_name[1][0];
		}
	};

	const getColor = () => {
		const colors = ["#0086A6"];

		const length = colors.length - 1;
		const color = colors[Math.floor(Math.random() * length)];
		// console.log(color);
		return color;
	};

	const div_style = {
		backgroundColor: getColor(),
		height: `${size}px`,
		width: `${size}px`,
		borderRadius: "50%",
		border: "1px solid rgba(166,173,201,.4)",
		textAlign: "center",
		display: "flex",
		justifyContent: "center",
	};

	const text_style = {
		margin: "auto",
		fontSize: `${Math.floor(size * 0.5)}px`,
		fontWeight: "bold",
		color: "azure",
	};

	return (
		<div style={div_style}>
			<p style={text_style}>{getInitials()}</p>
		</div>
	);
};
