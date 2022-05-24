const Connections = require("./connections");

module.exports = (io) => {
  
  io.on('connection', socket => {

    console.log(socket.id);

    socket.on('login', e => {
      // e: { username: string, userId: string }
      Connections.bindUser(socket.id, e.username, null, e.userId, null);
      socket.join(e.username); // subscribe to a room with this username
    });

    socket.on('join-room', e => {
      // e: { 
      //   username: string, 
      //   roomName: string, 
      //   alias: string, 
      //   userId: string, 
      //   hash: string 
      // }
      Connections.bindUser(socket.id, e.username, e.alias, e.userId, e.hash);
      Connections.joinRoom(socket.id, e.roomName);
      socket.join(e.roomName); // subscribe to this public chat room
      socket.join(e.username); // subscribe to a room with this username

      e.socketid = socket.id;
      e.participants = Connections.getParticipants(e.roomName);

      console.log(`server:31 ${e.username} joined room ${e.roomName}`);
      console.log(`server:32 ${e.roomName} participants:`, e.participants);
      io.to(e.roomName).emit('join-room', e); // broadcast join to room
    });

    socket.on('get-room-participants', e => {
      // e: { roomName }
      let p = Connections.getParticipants(e.roomName);
      socket.emit('join-room', { participants: p });
    });

    socket.on('leave-public-room', () => {
      if (!Connections.ids[socket.id]) return;

      let user = Connections.ids[socket.id];
      let publicRoom = user.room;
      let privateRoom = user.privateRoom;
      Connections.disconnect(socket.id);

      console.log(publicRoom, privateRoom);

      if (publicRoom != null) {
        let p1 = Connections.getParticipants(publicRoom);
        console.log(p1);
        io.to(publicRoom).emit('join-room', { participants: p1 });
        socket.leave(publicRoom);
      }

      if (privateRoom != null) {
        let p2 = Connections.getParticipants(privateRoom);
        io.to(privateRoom).emit('join-room', { participants: p2 });
        socket.leave(privateRoom);
      }
      console.log("index.js:96", Connections.ids, Connections.online, Connections.rooms);
    });
    
    socket.on('message', e => {
      // e: {
      //   _id: string,
      //   userData: { name: string } | { alias: string },
      //   tag: string,
      //   isPrivate: bool,
      //   message: string
      // }
      // console.log('message', e);
      let room;
      if (e.isPrivate) room = Connections.messagePrivate(socket.id);
      else room = Connections.messageRoom(socket.id);

      // console.log(`sending to ${room}`);
      io.to(room).emit('message', { 
        _id: e._id,
        userData: e.userData,
        message: e.message,
        isPrivate: e.isPrivate,
        timestamp: new Date(),
        socketid: socket.id
      });
    });

    socket.on('request-private-chat', e => {
      // e: { from: string, fromAlias: string, fromUserId: string, to: string }
      // console.log("56: request-prc", e);
      io.to(e.to).emit('request-private-chat', e);
    });

    socket.on('accept-private-chat', e => {
      // e: { userAlias, userId, userName, hash }
      if (e.participants.length < 2) return;

      let user1 = Connections.online[e.participants[0].userName];
      let user2 = Connections.online[e.participants[1].userName];

      let roomName;
      if (user1.hash < user2.hash)
        roomName = `${user1.hash} ${user2.hash} ${user1.room}`;
      else
        roomName = `${user2.hash} ${user1.hash} ${user1.room}`;

      let socketid1 = user1.sessions.values().next().value;
      let socketid2 = user2.sessions.values().next().value;
      Connections.joinRoom(socketid1, roomName);
      Connections.joinRoom(socketid2, roomName);
      user1.privateRoom = roomName;
      user2.privateRoom = roomName;
      
      io.sockets.sockets.get(socketid1).leave(user1.room);
      io.sockets.sockets.get(socketid2).leave(user2.room);
      io.sockets.sockets.get(socketid1).join(roomName);
      io.sockets.sockets.get(socketid2).join(roomName);
      
      io.to(e.userName).emit('accept-private-chat');

      // console.log("index.js:91", Connections.ids, Connections.online, Connections.rooms);
    });

    socket.on('leave-private-chat', () => {
      let user = Connections.ids[socket.id];
      if (!user) return;
      socket.leave(user.privateRoom);
      socket.join(user.room);
      user.privateRoom = null;
      io.to(user.room).emit('join-room', { participants: Connections.getParticipants(user.room) });
    });

    socket.on('disconnect', () => {
      if (!Connections.ids[socket.id]) return;

      let user = Connections.ids[socket.id];
      let publicRoom = user.room;
      let privateRoom = user.privateRoom;
      Connections.disconnect(socket.id);

      if (publicRoom != null) {
        let p1 = Connections.getParticipants(publicRoom);
        io.to(publicRoom).emit('join-room', { participants: p1 });
      }

      if (privateRoom != null) {
        let p2 = Connections.getParticipants(privateRoom);
        io.to(privateRoom).emit('join-room', { participants: p2 });
      }      
      console.log("index.js:96", Connections.ids, Connections.online, Connections.rooms);
    });

  });

}
