import io from "socket.io-client";
console.log("running");
// export const socket = io(
//   process.env.NODE_ENV == "dev" ? 'http://localhost:5000' : process.env.SOCKET_IO_URL
// );
//const socket = io("http://localhost:5000");
const server = `http://localhost:5000`;

const socket = io(server, {
	query: {
		token: localStorage.getItem("userToken-team46"),
	},
});

export default socket;
