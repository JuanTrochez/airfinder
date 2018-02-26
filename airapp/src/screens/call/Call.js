import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

const pcPeers = {};
const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

let localStream;
let container;

var socket;

export default class Call extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      info: 'Initializing',
      status: 'init',
      roomID: this.props.roomID,
      isFront: true,
      selfViewSrc: null,
      encodedImg : '',
      remoteList: {},
      textRoomConnected: false,
      textRoomData: [],
      textRoomValue: '',
      gestureState: {},
    };

    //Recupere la socket passee en parametre
    socket = this.props.socketConnexion;
    socket.set_call(this);
    this.userRole = this.props.userRole;

    //Hide the top navbar
    this.props.navigator.toggleNavBar({
      to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
      animated: true // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
    });
  }

  componentDidMount(){
    //user get the call, we take the stream
    container = this;
    getLocalStream(false, function(stream) {
      localStream = stream;
      container.setState({selfViewSrc: stream.toURL()});
      container.setState({status: 'ready'});
      joinRoom(container.state.roomID);
      this.timerTask(this);
    }.bind(this));
  }

  callExchange(data){
    exchange(data);
  }

  callLeave(socketID){
    leave(socketID);
    this._redirectionHome();
  }

  callJoin(socketIds){
    for (const i in socketIds) {
      const socketId = socketIds[i];
      createPC(socketId, true);
    }
  }

  _redirectionHome(){
    this.props.navigator.dismissModal({
      animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
    });
  }

  //send our coordinates to our friend
  sendMessage(message) {
    console.log("Envoie de message" + Object.keys(pcPeers).length);
    for (const key in pcPeers) {
      const pc = pcPeers[key];
      console.log('envoie de message à ', pc);
      console.log("Valeur de dataChannel: " , pc.textDataChannel);
      if(pc.textDataChannel === undefined){
        console.log("create data channel");
        createDataChannel();
      }
      pc.textDataChannel.send(message);
    }
   }

  hangUp(){
    alert('Appel terminé');
    socket.sendMessage('message', {type: 'hangUp'});
  }

  timerTask(objectCall) {
    console.log("timed");
    setInterval(() => {
      console.log("interval");
      objectCall.sendMessage(JSON.stringify({value:'lolilol'}));
      objectCall.sendMessage({value:'lolilol'});
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.compassHolder}>
          <Text>
            Welcome to React Native!
          </Text>
        </View>
        <View style={styles.buttonHolder}>
          <TouchableOpacity style={styles.hangupStyle} onPress= {this.hangUp.bind(this)}>
            <Text style={styles.hangupTextStyle}> Raccrocher </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

/*-----------------------------------Dark Side-----------------------------------*/

function getLocalStream(isFront, callback) {

  let videoSourceId;

  // on android, you don't have to specify sourceId manually, just use facingMode
  // uncomment it if you want to specify
  if (Platform.OS === 'ios') {
    MediaStreamTrack.getSources(sourceInfos => {
      for (const i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.id;
        }
      }
    });
  }

  getUserMedia({
    audio: true,
    video: false,
  }, function (stream) {
    console.log('getUserMedia success', stream);
    callback(stream);
  }, logError);
}

function joinRoom(roomID) {
  socket.sendMessageCallBack('join', roomID);
}

function createPC(socketId, isOffer) {
  const pc = new RTCPeerConnection(configuration);
  console.log("SockedId: " + socketId);
  console.log("Valeur de pc: ", pc);
  pcPeers[socketId] = pc;
  pc.onicecandidate = function (event) {
    console.log("log 1 onicecandidate");
    console.log('onicecandidate', event.candidate);
    if (event.candidate) {
      socket.sendMessage('exchange', {'to': socketId, 'candidate': event.candidate });
    }
  };
  function createOffer() {
    pc.createOffer(function(desc) {
      console.log('createOffer', desc);
      pc.setLocalDescription(desc, function () {
        console.log('setLocalDescription', pc.localDescription);
        socket.sendMessage('exchange', {'to': socketId, 'sdp': pc.localDescription });
      }, logError);
    }, logError);
  }
  pc.onnegotiationneeded = function () {
    console.log('onnegotiationneeded');
    if (isOffer) {
      createOffer();
    }
  }
  pc.oniceconnectionstatechange = function(event) {
    console.log('oniceconnectionstatechange', event.target.iceConnectionState);
    if (event.target.iceConnectionState === 'completed') {
      setTimeout(() => {
        getStats();
      }, 1000);
    }
    if (event.target.iceConnectionState === 'connected') {
      createDataChannel();
    }
  };

  pc.onsignalingstatechange = function(event) {
    console.log('onsignalingstatechange', event.target.signalingState);
  };

  pc.onaddstream = function (event) {
    console.log('onaddstream', event.stream);
    container.setState({info: 'One peer join!'});

    const remoteList = container.state.remoteList;
    remoteList[socketId] = event.stream.toURL();
    container.setState({ remoteList: remoteList });
  };

  pc.onremovestream = function (event) {
    console.log("log 6 onremovestream");
    console.log('onremovestream', event.stream);
  };

  pc.addStream(localStream);

  function createDataChannel() {
    if (pc.textDataChannel) {
      return;
    }
    const dataChannel = pc.createDataChannel("text");

    dataChannel.onerror = function (error) {
      console.log("dataChannel.onerror", error);
    };

    dataChannel.onmessage = function (event) {
      //console.log("dataChannel.onmessage reload:", event.data);
      //TODO faire les calculs avec les coordonnees de l'interllocuteur
      let coordinates = JSON.parse(event.data);
      console.log('Reception message: ' + coordinates);
    };

    dataChannel.onopen = function () {
      console.log('dataChannel.onopen');
      container.setState({textRoomConnected: true});
    };

    dataChannel.onclose = function () {
      console.log("dataChannel.onclose");
    };

    pc.textDataChannel = dataChannel;
    console.log("textDataChannel created: ", pc.textDataChannel);
  }
  return pc;
}

function getStats() {
  const pc = pcPeers[Object.keys(pcPeers)[0]];
  if (pc.getRemoteStreams()[0] && pc.getRemoteStreams()[0].getAudioTracks()[0]) {
    const track = pc.getRemoteStreams()[0].getAudioTracks()[0];
    console.log('track', track);
    pc.getStats(track, function(report) {
      console.log('getStats report', report);
    }, logError);
  }
}

function exchange(data) {
  const fromId = data.from;
  let pc;
  if (fromId in pcPeers) {
    pc = pcPeers[fromId];
  } else {
    pc = createPC(fromId, false);
  }

  if (data.sdp) {
    console.log('exchange sdp', data);
    pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
      if (pc.remoteDescription.type == "offer")
        pc.createAnswer(function(desc) {
          console.log('createAnswer', desc);
          pc.setLocalDescription(desc, function () {
            console.log('setLocalDescription', pc.localDescription);
            socket.sendMessage('exchange', {'to': fromId, 'sdp': pc.localDescription });
          }, logError);
        }, logError);
    }, logError);
  } else {
    console.log('exchange candidate', data);
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
}

function leave(socketId) {
  for(const key in pcPeers){
    const pc = pcPeers[key];
    const viewIndex = pc.viewIndex;
    pc.close();
    delete pcPeers[key];

    const remoteList = container.state.remoteList;
    delete remoteList[key]
    container.setState({ remoteList: remoteList });
    container.setState({info: 'One peer leave!'});
  }

  if(socketId != container.props.socketID){
    container.hangUp();
  }

  container.setState({textRoomConnected: false});
}

function logError(error) {
  console.log("logError", error);
}

function mapHash(hash, func) {
  const array = [];
  for (const key in hash) {
    const obj = hash[key];
    array.push(func(obj, key));
  }
  return array;
}
/*-------------------------------------------------------------------------------*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#F5FCFF',
  },
  compassHolder: {
    flex: 6,
  },
  buttonHolder: {
    flex: 0.5,
    backgroundColor:'#FF0000',
  },
  hangupStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hangupTextStyle: {
    textAlign : 'center',
    color : '#FFFFFF',
    fontSize : 18,
    fontWeight: 'bold',
  }
});
