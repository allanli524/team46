import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { addUser } from "../../Redux/Reducers/userSlice";
import { registerUser } from "../../Redux/Reducers/async thunk/AuthRequests";

const users = [{ username: "Tag", password: "csc309", name: "Junaid", age: "22", bio: "just a guy" }];

class Signup extends Component {
	constructor() {
		super();

		this.state = {
			username: "",
			name: "",
			password: "",
			cpassword: "",
			isloading: false,
			error: null,
		};

		this.handleText = this.handleText.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
	}

	handleText = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSignup = async (event) => {
		event.preventDefault();

		this.setState({ isloading: true });

		if (this.state.password === this.state.cpassword) {
			const user = {
				username: this.state.username,
				password: this.state.password,
				name: this.state.name,
			};

			const { payload } = await this.props.registerUser(user);
			console.log(payload);

			if (payload) {
				if (payload.success) {
					this.setState({ isloading: false });

					this.props.navigate("/login");
				} else {
					if (this.props.errorSlice.id === 110) {
						this.setState({ error: this.props.errorSlice.msg });
					}

					this.setState({ username: "", password: "", cpassword: "", isloading: false });
				}
			} else {
				if (this.props.errorSlice.id === 110) {
					this.setState({ error: this.props.errorSlice.msg });
				}

				this.setState({ username: "", password: "", cpassword: "", isloading: false });
			}
		} else {
			this.setState({ password: "", cpassword: "", isloading: false });
		}
	};

	render() {
		const { error } = this.state;

		return (
			<div className={styles.body}>
				<div className={styles.form_wrapper}>
					<h2 className={styles.create}>Signup</h2>
					<div className={styles.error}>{error ? `*${error}` : null}</div>
					<form onSubmit={this.handleSignup}>
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

						<label for="name">Name</label>
						<input
							type="text"
							id="name"
							name="name"
							placeholder="Name"
							className={styles.input}
							value={this.state.name}
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

						<label for="cpassword">Confirm Password</label>
						<input
							type="password"
							id="cpword"
							name="cpassword"
							placeholder="Confirm Password"
							className={styles.input}
							value={this.state.cpassword}
							required={true}
							onChange={this.handleText}
						/>
						<div className={styles.login}>
							<button type="submit" className={styles.login_submit}>
								Signup
							</button>
						</div>
						<div className={styles.registerAccount}>
							<h1 className={styles.noaccount}>Already have an Account?&nbsp;</h1>
							<Link to="/login">Login Here</Link>
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
		addUser: (user) => dispatch(addUser(user)),
		registerUser: (user) => dispatch(registerUser(user)),
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

	return <Signup {...props} navigate={navigate} />;
});
