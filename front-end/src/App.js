import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./lib/socketio";
import PrivateScreen from "./Components/private screen/PrivateScreen";
import PrivateRoute from "./Components/routing/PrivateRoute";
import Landing from "./Components/Landing/Landing";
import Settings from "./Components/Settings/Settings";
import PublicChat from "./Components/Auth/Chat/public/PublicChat";
import PrivateChat from "./Components/Auth/Chat/private/PrivateChat";
import EnterRoom from "./Components/Auth/Landing/EnterRoom";
import Login from "./Components/Login Signup/Login";
import Signup from "./Components/Login Signup/Signup";
import AdminMenu from "./Components/AdminMenu/AdminMenu";
import Header from "./Components/Header/Header";

function App() {
	return (
		<div className="App">
			<Header />
			<div className="App-body">
				<Router>
					<Routes>
						<Route exact path="/" element={<PrivateScreen />} />
						<Route path="/landing" element={<Landing />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route
							path="/roomform"
							element={
								<PrivateRoute>
									<EnterRoom />
								</PrivateRoute>
							}
						/>
						<Route
							path="/settings"
							element={
								<PrivateRoute>
									<Settings />
								</PrivateRoute>
							}
						/>
						<Route
							path="/pc"
							element={
								<PrivateRoute>
									<PublicChat />
								</PrivateRoute>
							}
						/>
						<Route
							path="/prc"
							element={
								<PrivateRoute>
									<PrivateChat />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin"
							element={
								<PrivateRoute>
									<AdminMenu />
								</PrivateRoute>
							}
						/>
					</Routes>
				</Router>
			</div>
		</div>
	);
}

export default App;

/*
<Routes>
	<Route exact path="/" element={<Landing />} />
	<Route exact path="/login" element={<Login />} />
	<Route exact path="/signup" element={<Signup />} />
	<Route exact path="/roomform" element={<EnterRoom />} />
	<Route path="/settings" element={<Settings />} />
	<Route path="/pc" element={<PublicChat />} />
	<Route path="/prc" element={<PrivateChat />} />
	<Route path="/admin" element={<AdminMenu />} />
</Routes>
*/
