'use strict';

import io from 'socket.io-client';

//*********const

const socketCo = null;
//const socketCo = io.connect('http://9a31eca1.ngrok.io', {transports: ['websocket']}); //7ADigital


var tabOnlineFriend = null;

export default class Socket {

  constructor(tabOnlineFriendObject){
    tabOnlineFriend = tabOnlineFriendObject;
    socketCo = io.connect('http://172.16.14.80:3000', {transports: ['websocket']}); //Guest
    this.onReceiveMessage(); //permet de se mettre sur ecoute des serveurs message
  }

  sendMessage(eventSocket,obj){
    console.log("sending message: " + eventSocket);
    socketCo.emit(eventSocket,obj);
  }

  sendMessageCallBack(eventSocket, strRoomId){
    socketCo.emit(eventSocket,strRoomId,function(socketTab){
      call.callJoin(socketTab);
    });
  }

  onReceiveMessage(){
    socketCo.on('message', function(message){
      var data = message;
      switch(data.type) {
           case "login":

                  break;
           case "call_response":
                  tabOnlineFriend.onResponse(data);
                  break;
           case "answer":
                  tabOnlineFriend.popUpCall(data);
                  break;
           default:
              break;
      }
    }.bind(this));

    socketCo.on('connect', function() {
      tabOnlineFriend.setState({userSocketId: socketCo.id});
    });

    socketCo.on('roommessage', function(message){
        var data = message;

        switch(data.type) {
             case "login":

                    break;
             case "disconnect":

                     break;
            default:
                    break;
        }
    }.bind(this));

    socketCo.on('exchange', function(data){
      //start exchange webRTC
      //call.callExchange(data);
    }.bind(this));

    socketCo.on('leave', function(socketId){
      //call.callLeave(socketId);
    }.bind(this));
  }
}
