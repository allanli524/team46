class SocketConnections {
	/* Assumptions:
    - a client only subscribes to one room at a time 
    - usernames are unique
  */

  constructor() {
    this.ids = {}; // map socket ids to user objs
    this.online = {}; // map usernames of connected users to user objs
    this.rooms = {}; // map unique room name to room objs
    this.alias = {}; // map alias names to usernames
  }

  bindUser(socketid, username, alias, userId, hash) {
    // bind this session to a user
    if (username in this.online) {
      this.ids[socketid] = this.online[username];
      this.online[username].addSession(socketid);
      this.alias[alias] = username;
    }
    else {
      this.ids[socketid] = new User(username, socketid, null, userId, hash, alias);
      this.online[username] = this.ids[socketid];
      this.alias[alias] = username;
    }
  }

  createRoom(roomName) {
    // creates a room with name if it doesn't already exist
    if (this.rooms[roomName]) return;
    this.rooms[roomName] = new Room(roomName);
  }

  joinRoom(socketid, roomName) {
    // have socketid subscribe to room
    if (!(roomName in this.rooms)) this.createRoom(roomName);
    let room = this.rooms[roomName];
    let user = this.ids[socketid];
    room.addUser(socketid, user);
    user.joinRoom(roomName);
  }

  leaveRoom(socketid, roomName) {
    
  }

  disconnect(socketid) {
    // leave the room 
    if (!(socketid in this.ids)) 
      return; // auto-return if session isn't bound

    let user = this.ids[socketid];
    if (user.room)
      this.rooms[user.room].removeUser(socketid);

    user.removeSession(socketid);
    if (!user.hasSessions()) {
      let username = user.username;
      delete this.online[username];
    }

    delete this.ids[socketid];
  }

  messageRoom(socketid) {
    return this.ids[socketid].room;
  }

  messagePrivate(socketid) {
    return this.ids[socketid].privateRoom;
  }

  getParticipants(roomName) {
    if (!(roomName in this.rooms)) return [];
    return this.rooms[roomName].getParticipants();
  }

  getUser(socketid) {
    return this.ids[socketid];
  }

  getParticipants(roomName) {
    if (!(roomName in this.rooms)) return [];
    return this.rooms[roomName].getParticipants();
  }

  getUser(socketid) {
    return this.ids[socketid];
  }

}

class Room {
	constructor(roomId) {
		this.users = {}; // map socketid to user obj
		this.roomId = roomId;
	}

	addUser(socketid, user) {
		this.users[socketid] = user;
	}

	removeUser(socketid) {
		delete this.users[socketid];
	}

	getParticipants() {
		let lst = [];
		for (let key in this.users) {
			if (this.users[key].privateRoom == null) lst.push(this.users[key].getInfo());
		}
		return lst;
	}
}

class User {
	constructor(socketid, userId) {
		this.userId = userId;
		this.sessions = new Set([socketid]);
	}

	joinRoom(roomName) {
		this.room = roomName;
	}

	addSession(socketid) {
		this.sessions.add(socketid);
	}

	removeSession(socketid) {
		this.sessions.delete(socketid);
	}

	hasSessions() {
		return this.sessions.size > 0;
	}

	getInfo() {
		return {
			userName: this.username,
			userId: this.userId,
			hash: this.hash,
			userAlias: this.alias,
		};
	}
}

const Connections = new SocketConnections();
module.exports = Connections;
