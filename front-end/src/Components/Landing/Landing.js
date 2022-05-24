import "./Landing.css";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
	const navigate = useNavigate();

	useEffect(async () => {
		if (localStorage.getItem("userToken-team46")) {
			navigate("/");
		}
	}, [navigate]);

	return (
		<div className="landing-page">
			<div className="landing-banner">
				<h1 className="landing-banner-title">
					Welcome to "temp name"<h6>(Work in progress)</h6>
				</h1>
				<Link className="landing-link-button" id="landing-link" to="/login">
					Already a member? Click to login.
				</Link>
				<Link className="landing-link-button" id="landing-link" to="/signup">
					Not a member? Click to join.
				</Link>
			</div>
			<div className="landing-info">
				<h5 style={{ margin: "25px 0px" }}>Join us to chat with others with the same </h5>
				<h5 style={{ margin: "25px 0px" }}>interests and further your relationships by </h5>
				<h5 style={{ margin: "25px 0px" }}>inviting to carry on chatting in private.</h5>
			</div>
		</div>
	);
};

export default Landing;
