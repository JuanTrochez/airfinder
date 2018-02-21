import usersController from '../controllers/usersController';

let connectedUsers = [];

//user socket events
module.exports = function(io) {
  console.log('init user events...');
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', (data) => {
      console.log('message received', data, connectedUsers.length);
      connectedUsers.forEach(element => {
        console.log(element.id + ' ' + data.receiver);
        if (element.id === data.receiver) {
          data.type = 'answer';
          console.log('sending message', data);
          element.socket.send(data);
        }
      }); 
    });

    socket.on('get id', (data) => {
      console.log('get id', data);
      connectedUsers.push({id: data.userId, socket: socket});
    });

    socket.on('call accepted', (data) => {
      console.log('call is accepted', data);
      // connectedUsers.forEach(element => {
      //   console.log(element.id + ' ' + data.receiver);
      //   if (element.id === data.receiver) {
      //     data.type = 'call_accepted';
      //     console.log('sending message', data);
      //     element.socket.send(data);
      //   }
      // });       
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
      console.log('user disconnected');
      connectedUsers = connectedUsers.filter(element => element.socket.id != socket.id);
      // console.log('user disconnected', connectedUsers);
    });
  });
}
