import usersController from '../controllers/usersController';

let connectedUsers = [];

//user socket events
module.exports = function(io) {
  console.log('init user events...');
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('user connected');
    
    socket.on('message', (data) => {
      console.log('message received');
      // console.log(data, connectedUsers.length);
      if (data.type === 'hangUp') {
        console.log('end call');
        // console.log("HANGUP SERVER room: " + socket.room);
        // console.log("HANGUP SERVER id: " + socket.id);
        if (socket.room) {
          var room = socket.room;
          io.to(room).emit('leave', socket.id);
          socket.leave(room);
        }
      } else {
        connectedUsers.forEach(element => {
          // console.log(element.id + ' ' + data.receiver);
          if (element.id === data.receiver) {
            // console.log('sending message');
            // console.log(data);
            data.type = 'answer';
            element.socket.send(data);
          }
        });
      }
    });
    
    socket.on('get id', (data) => {
      console.log('get id');
      // console.log(data);
      connectedUsers.push({id: data.userId, socket: socket});
      let user = {
        id: data.userId,
        isOnline: true
      }
      usersController.update_user(user);
      socket.broadcast.emit('roommessage', {
        type: 'login',
        personId: user.id
      });

    });
    
    socket.on('call answer', (data) => {
      console.log('call is accepted');
      // console.log(connectedUsers.length);
      connectedUsers.forEach(element => {
        // console.log(element.id + ' ',  data);
        if (element.id === data.callerId) {
          // console.log('sending message', data);
          element.socket.send(data);
        }
      });       
    });
    
    socket.on('exchange', function(data){
      console.log('exchange', data);
      data.from = socket.id;
      var to = io.sockets.connected[data.to];
      to.emit('exchange', data);
    });
    
    socket.on('join', function(name, callback){
      // console.log('join '+ name);
      var socketIds = socketIdsInRoom(name);
      
      //TEST**
      // console.log(socketIds.length + " valeur du if " + (socketIds.length < 2));
      for (const i in socketIds) {
        const socketId = socketIds[i];
        // console.log("SOCKET ON join(): "+socketId);
      }
      // FIN TEST**
      
      callback(socketIds);
      socket.join(name);
      socket.room = name;
    });
    
    function socketIdsInRoom(name) {
      var socketIds = io.nsps['/'].adapter.rooms[name];
      if (socketIds) {
        var collection = [];
        for (var key in socketIds['sockets']) {
          collection.push(key);
        }
        return collection;
      } else {
        return [];
      }
    }
    
    
    socket.on('disconnect', () => {
      //mettre a jour l'user (isOnline)
      console.log('user disconnected');
      connectedUsers = connectedUsers.filter(element => {
        if (element.socket.id == socket.id) {
          let user = {
            id: element.id,
            isOnline: false
          }
          usersController.update_user(user);

          socket.broadcast.emit('roommessage', {
            type: 'disconnect',
            personId: user.id
          });
        }
        return element.socket.id != socket.id;
      });
      
      // console.log('user disconnected', connectedUsers);
    });
  });
}
