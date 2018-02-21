import React, { Component } from 'react';
import ServerConfig from '../../../config/server-config';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  Alert
} from 'react-native';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

import Socket from '../socket/Socket';

export default class TabOnlineFriend extends Component<{}> {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      userName: this.props.objUser.name,
      userFirstName: this.props.objUser.firstname,
      userRoomId: 'room'+this.props.objUser._id,
      userId: this.props.objUser._id,
      userSocketId: null,
      userRole: "neutre",
    };
    this.busy = false;
    this.listUserConnect = [];
    this.socket = new Socket(this);
  }

  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarComponentAlignment: 'center',
    navBarBackgroundColor: '#C0BAEF'
  };

  componentDidMount() {
    this.fillListHistory();
  }

  resetState() {
    this.setState({
      userName: this.props.objUser.name,
      userFirstName: this.props.objUser.firstname,
      userRoomId: 'room'+this.props.objUser._id,
      userId: this.props.objUser._id,
      userRole: "neutre",
    })
  };

  fillListHistory(){
    fetch(ServerConfig.url + 'users')
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.valid){
          responseJson.data.forEach(element => {
            this.updateListView(element,"add")
          });
        } else {
          switch(responseJson.code) {
            case "DISPLAY_ERRORS":
              let messageError = "";
              responseJson.errors.forEach((element) => {
                messageError += element.field + ":" + element.message + "\t";
              });
              alert(messageError);
              break;
            default:
              alert("Une erreur est survenue");
          }
        }
      });
  }

  updateListView(dataNewUser, action){
    if(action == "add"){
      this.listUserConnect.push({
        username: dataNewUser.name,
        userId: dataNewUser._id,
        userfirstname: dataNewUser.firstname,
        useremail: dataNewUser.email,
      });
    }else if(action == "remove"){
      this.listUserConnect = this.listUserConnect.filter(obj => obj.userId !== dataNewUser.userId);
    }
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.listUserConnect),
    });
  }

  callUser(userToCallId){
    let obj = {
      type: "call_user",
      receiver: userToCallId,
      callername: this.state.userName,
      callerId: this.state.userId,
      callerRoomId: this.state.userRoomId,
    };
    this.socket.sendMessage('message',obj);
  }

  popUpCall(data){
    if(this.busy == false) {
      Alert.alert(
        'Appel entrant',
        data.callername,
        [
          {text: 'Refuser', onPress: () => this.onAnswer(data,false)},
          {text: 'Accepter', onPress: () => this.onAnswer(data,true)},
        ]
      )
    }else {
      this.onAnswer(data,false);
    }
  }

  _redirectionCall(){
    alert('Redirection page d appel');
    // this.props.navigator.showModal({
    //   screen: 'DIFM_App.Home.Call',
    //   title: 'Appel',
    //   passProps: {
    //     userRole : this.state.userRole,
    //     socketConnexion : this.socket,
    //     roomID : this.state.userRoomId,
    //     socketID: this.state.dataSocket.userSocketId,
    //   },
    // });
  }

  //Quand un utilisateur nous appelle
  onAnswer(data, choice){
    if(this.busy == false){
      this.busy = true;
      incallwith = data.callername;
      if(choice){
        console.log("call accepted");
        // code
        this.setState({userRole: "appele"});
        this.setState({userRoomId: data.callerRoomId});
        this.socket.sendMessage('call accepted',{
          type: "call_accepted",
          callername: data.callername,
          callerId: data.callerId,
          from: this.state.username
        });
        this._redirectionCall();
      }else{
        console.log("call rejected");
        this.socket.sendMessage('message',{
          type: "call_rejected",
          callername: data.callername,
          callerId: data.callerId,
          from: this.state.username
        });
        this.busy = false;
        incallwith = "";
      }
    }else{
      this.socket.sendMessage('message',{
        type: "call_busy",
        callername: data.callername,
        callerId: data.callerId,
        from: this.state.username
      });
    }
  }

  //Quand on appel un utilisateur et qu'il repond
  onResponse(data){
    switch(data.response){
        case "accepted":
          incallwith = data.responsefrom;
          //alert("Call accepted by :"+ data.responsefrom);
          this.setState({userRole: "appeleur"});
          this.busy = true;
          this._redirectionCall();
          break;
        case "rejected":
          alert("Call rejected by :"+ data.responsefrom);
          busy = false;
          incallwith = ""
          break;
        case "busy":
          alert(data.responsefrom+" call busy");
          busy = false;
          incallwith = ""
          break;
        default:
          alert(data.responsefrom+" is offline");
          busy = false;
          incallwith = ""
    }
  }

  renderRow(rowData){
        return (
          <View style={styles.containerRow}>
            <Image source={require('../../../img/userImg.png')} style={styles.photo} />
            <View style={styles.nameStatus}>
              <Text style={styles.textName}>
                {`${rowData.username}`}
              </Text>
              <Text style={styles.textStatus}>
                {`${rowData.useremail}`}
              </Text>
            </View>
            <TouchableHighlight underlayColor='rgba(255, 255, 255, 0)' onPress={()=>{this.callUser(`${rowData.userId}`)}}>
              <Image
                source={require('../../../img/call.png')}
                style={styles.call}
              />
            </TouchableHighlight>
          </View>
        );
      }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
    opacity: 0.4,
    marginLeft: StyleSheet.hairlineWidth + 60
  },
  containerRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStatus:{
    flex: 1,
    flexDirection: 'column',
  },
  textName: {
    fontSize: 22,
    marginLeft : 15,
    flex: 1,
  },
  textStatus: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft : 15,
    color: '#A9A9A9',
  },
  photo: {
    height: 40,
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  call: {
    height: 40,
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
});
