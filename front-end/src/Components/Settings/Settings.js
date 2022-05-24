import React, { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRoom } from "../../Redux/Reducers/roomSlice";
import { unSetUser, setName, setAge, setBio } from "../../Redux/Reducers/userSlice";
import { logout } from "../../Redux/Reducers/authSlice";
import { logoutUser, deleteUser } from "../../Redux/Reducers/async thunk/AuthRequests";
import { getUser, setUser } from "../../Redux/Reducers/async thunk/UserRequests";
import { getProfilePic } from "../Utils/ProfilePic";
import { passwordValidator } from "../Utils/PasswordValidator";

const Settings = (props) => {
	const sample = {
		name: "i.e. Allan Li",
		age: 18,
		bio: "Hello! This is me.",
		email: "i.e. allanli@email.com",
		phoneNumber: "(123)-456-7890",
	}
	//form content
	const [name, setName] = useState(sample.name);
	const [age, setAge] = useState(sample.age);
	const [bio, setBio] = useState(sample.bio);
	const [email, setEmail] = useState(sample.email);
	const [phone, setPhone] = useState(sample.phoneNumber);
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");

	//static load
	const [pfp, setPfp] = useState(getProfilePic(props.userSlice.name, 100));

	//form edits
	const [changes, setChanges] = useState(false);

	//form errors
	const [errors, setErrors] = useState([]);

	//form visibility
	const [errorsDisplay, setErrorDisplay] = useState(false);

	useEffect(() => {
		// console.log(props.userSlice.age);
		props.getUser(props.userSlice.username).then((res) => {
			setName(res.payload.name);
			setEmail(res.payload.email);
			setPhone(res.payload.phoneNumber);
			setAge(res.payload.age);
			setBio(res.payload.bio);
		});
	},  [])


	const handleDelete = async (event) => {
		await props.deleteUser();
		await props.logoutUser();
		props.navigate("/");
	};

	const openRoomform = (event) => {
		props.navigate("/roomform");
	};

	const submitChecker = () => {
		let errors = [];
		if (!name.trim()) {
			errors.push("*Name cannot be empty");
		}
		if (!age) {
			errors.push("*Age cannot be empty");
		}
		if (!bio.trim()) {
			errors.push("*Bio cannot be empty");
		}
		if (!email.trim()) {
			errors.push("*Email cannot be empty");
		} else if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email.trim())) {
			errors.push("*Please enter a valid email");
		}
		if (!phone.trim()) {
			errors.push("*Phone number cannot be empty");
		} else if (!/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone.trim())) {
			errors.push("*Phone number must be in xxx-xxx-xxxx format");
		}
		const ret = passwordValidator(password, password2);
		if (ret) {
			errors.push(ret);
		}
		 return errors;
	}

	const formSubmit = () => {
		if (changes) {
			const error_list = submitChecker();
			if (error_list.length > 0) {
				setErrors(error_list);
				setErrorDisplay(true);
				return;
			}
			const info = {
				username: props.userSlice.username,
				name: name,
				age: age,
				bio: bio,
				email: email,
				phoneNumber: phone,
			}
			if (password) {
				info["password"] = password;
			}

			props.setUser(info).then((res) => {
				if (res.payload.success) {
					alert("Changes has been logged");
					setChanges(false);
					props.setNameRedux(name);
					props.setBioRedux(bio);
					props.setAgeRedux(age);
				} else {
					alert("Something went wrong, please try again later...");
				}
				openRoomform();
			})
		} else {
			alert("No changes detected");
		}
	}

	const handleText = (event) => {
		switch (event.target.id) {
			case "name":
				setName(event.target.value);
				setChanges(true);
				break;
			case "email":
				setEmail(event.target.value);
				setChanges(true);
				break;
			case "phone":
				setPhone(event.target.value);
				setChanges(true);
				break;
			case "age":
				setAge(event.target.value);
				setChanges(true);
				break;
			case "bio":
				setBio(event.target.value);
				setChanges(true);
				break;
			case "password":
				setPassword(event.target.value);
				setChanges(true);
				break;
			case "confirm_password":
				setPassword2(event.target.value);
				setChanges(true);
				break;
			default:
				break;
		}
		setErrorDisplay(false);
		setErrors([]);
	}

	const toggleVisibility = (event) => {
		const pw1 = document.getElementById("password");
		const pw2 = document.getElementById("confirm_password");
		if (event.target.attr == "0") {
			//turn on
			pw1.type = "password";
			pw2.type = "password";
			event.target.attr = "1";
		} else {
			//turn off
			pw1.type = "text";
			pw2.type = "text";
			event.target.attr = "0";
		}
	}
	return (
		<div className={styles.body}>
			<div className={styles.card}>
				<div className={styles.header}>Settings</div>

				<div className={styles.container}>
					{pfp}
					{/* <div className={styles.profile_img}> */}
						
						{/* <img src={require("./profile_picture.png")} /> */}
					{/* </div> */}
					{/* <button className={`${styles.button} ${styles.upload_button}`}>Upload</button>
					<button className={`${styles.button} ${styles.upload_button}`}>Remove</button> */}
				</div>

				{ errorsDisplay && 
					<div>
						{errors.map((error_text, index) => {
							return <p key={index} className={styles.error_text}>{error_text}</p>
						})}
					</div>
				}

				<div className={styles.seperator_line} />

				<div className={styles.flex_container}>
					<div className={styles.input_field}>
						<div className={styles.label}>Full Name</div>
						<input type="text" placeholder={name} id="name" onChange={handleText}/>
					</div>
					<div className={styles.input_field}>
						<div className={styles.label}>Age</div>
						<input type="number" min="14" max="120" placeholder={age} id="age" onChange={handleText}/>
					</div>
				</div>

				<div className={styles.seperator_line} />
				
				<div className={styles.flex_container}>
					<div className={styles.input_field}>
						<div className={styles.label}>Bio</div>
						<input type="text" placeholder={bio} id="bio" onChange={handleText}/>
					</div>
				</div>

				<div className={styles.seperator_line} />

				<div className={styles.flex_container}>
					<div className={styles.input_field}>
						<div className={styles.label}>New Password</div>
						<input type="password" placeholder="new_password" id="password" onChange={handleText}/>
					</div>

					<div className={styles.input_field}>
						<div className={styles.label}>Confirm Password</div>
						<input type="password" placeholder="new_password" id="confirm_password" onChange={handleText}/>
					</div>
				</div>
				<div className={styles.radio_container}>
					<div className={styles.label_small}>View Password  </div>
					<input type="checkbox" attr="0" id="pw_v" onClick={toggleVisibility}/>
				</div>

				<div className={styles.seperator_line} />

				<div className={styles.flex_container}>
					<div className={styles.input_field}>
						<div className={styles.label}>Email Address</div>
						<input type="text" placeholder={email} id="email" onChange={handleText}/>
					</div>

					<div className={styles.input_field}>
						<div className={styles.label}>Phone Number</div>
						<input type="text" placeholder={phone} id="phone" onChange={handleText}/>
					</div>
				</div>

				<div className={styles.seperator_line} />

				<div className={styles.flex_container}>
					<div>
						<div className={styles.label}> Delete Account</div>
						<div className={styles.warning}>(warning: you will lose all your data!)</div>
					</div>

					<button className={styles.button} onClick={handleDelete}>
						Delete Account...
					</button>
				</div>

				<div className={styles.seperator_line} />

				<button className={`${styles.button} ${styles.save_button}`} onClick={formSubmit}>
					Save Changes
				</button>
				<button className={`${styles.button}`} onClick={openRoomform}>
					Back
				</button>
			</div>
		</div>
	);
};

function mapStateToProps(state) {
	return {
		authSlice: state.authSlice,
		userSlice: state.userSlice,
	};
}

const mapDispatchToProps = (dispatch) => {
	return {
		setRoom: (room) => dispatch(setRoom(room)),
		unSetUser: () => dispatch(unSetUser()),
		logout: () => dispatch(logout()),
		logoutUser: () => dispatch(logoutUser()),
		deleteUser: () => dispatch(deleteUser()),
		getUser: (username) => dispatch(getUser(username)),
		setUser: (payload) => dispatch(setUser(payload)),
		setNameRedux: (name) => dispatch(setName(name)),
		setAgeRedux: (age) => dispatch(setAge(age)),
		setBioRedux: (bio) => dispatch(setBio(bio)),
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
		};
	});

	return <Settings {...props} navigate={navigate}/>;
});
