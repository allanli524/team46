import styles from "./Login.module.css";
import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLoading, userLoaded, setAuthenticated } from "../../Redux/Reducers/authSlice";
import { setUser } from "../../Redux/Reducers/userSlice";
import { loginUser } from "../../Redux/Reducers/async thunk/AuthRequests";
import socket from "../../lib/socketio";

class Login extends Component {
	constructor() {
		super();

		this.state = {
			username: "",
			password: "",
			error: null,
		};

		this.handleText = this.handleText.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleText = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleLogin = async (event) => {
		event.preventDefault();

		const credentials = { username: this.state.username, password: this.state.password };
		const { payload } = await this.props.loginUser(credentials);
		// console.log(payload, this.props);

		if (payload) {
			if (payload.success) {
				if (!payload.user.isDeleted) {
					if (payload.user.isAdmin) {
						this.setState({ username: "", password: "" });
						this.props.navigate("/admin");
					} else {
						this.setState({ username: "", password: "" });
						this.props.navigate("/roomform");
					}

					// bind this socket.id to username
					socket.emit("login", { 
						username: credentials.username,
						userId: payload.user._id
					});

				} else {
					this.setState({ username: "", password: "" });
				}
			}
		} else {
			if (this.props.errorSlice.id === 110) {
				this.setState({ error: this.props.errorSlice.msg });
			}

			this.setState({ username: "", password: "" });
		}
	};

	render() {
		const { error } = this.state;

		return (
			<div className={styles.body}>
				<div className={styles.form_wrapper}>
					<h2 className={styles.create}>Welcome Back!</h2>
					<div className={styles.error}>{error ? `*${error}` : null}</div>
					<form onSubmit={this.handleLogin}>
						<label for="username">Username</label>
						<input
							type="text"
							id="uname"
							name="username"
							placeholder="Username"
							className={styles.input}
							value={this.state.username}
							required={true}
							onChange={this.handleText}
						/>

						<label for="password">Password</label>
						<input
							type="password"
							id="pword"
							name="password"
							placeholder="Password"
							className={styles.input}
							value={this.state.password}
							required={true}
							onChange={this.handleText}
						/>
						<div className={styles.login}>
							<button type="submit" className={styles.login_submit}>
								Login
							</button>
						</div>
						<div className={styles.registerAccount}>
							<h1 className={styles.noaccount}>Need to create an Account?&nbsp;</h1>
							<Link to="/signup">Sign up Here</Link>
						</div>
					</form>
				</div>
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
		userLoading: () => dispatch(userLoading()),
		userLoaded: () => dispatch(userLoaded()),
		loginUser: (data) => dispatch(loginUser(data)),
		setAuthenticated: (bool) => dispatch(setAuthenticated(bool)),
		setUser: (user) => dispatch(setUser(user)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(function (props) {
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem("userToken-team46")) {
			navigate("/");
		}
	}, [navigate]);

	return <Login {...props} navigate={navigate} />;
});
