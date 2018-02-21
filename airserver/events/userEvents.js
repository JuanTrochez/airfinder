import usersController from '../controllers/usersController';

let connectedUsers = [];

//user socket events
module.exports = function(io) {
  console.log('init user events...');
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (data) => {
      console.log('message received', data);
    });

    socket.on('get id', (data) => {
      console.log('get id', data);
      connectedUsers.push({id: data.userId, socketId: socket.id});
    });

    // On conversation entry, join broadcast channel
    socket.on('enter conversation', (conversation) => {
      socket.join(conversation);
      // console.log('joined ' + conversation);
    });

    socket.on('leave conversation', (conversation) => {
      socket.leave(conversation);
      // console.log('left ' + conversation);
    })

    socket.on('new message', (conversation) => {
      io.sockets.in(conversation).emit('refresh messages', conversation);
      });

    socket.on('disconnect', () => {
      //console.log('user disconnected');
      connectedUsers = connectedUsers.filter(element => element.socketId != socket.id);
      // console.log('user disconnected', connectedUsers);
    });
  });
}
