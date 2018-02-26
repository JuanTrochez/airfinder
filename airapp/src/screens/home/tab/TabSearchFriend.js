import React, { Component } from 'react';
import ServerConfig from '../../../config/server-config';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ListView,
  TouchableHighlight
} from 'react-native';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class TabSearchFriend extends Component<{}> {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      research: "",
    }
    this.listUserConnect = [];
  }

  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarComponentAlignment: 'center',
    navBarBackgroundColor: '#C0BAEF'
  };

  onResearchChanged(event) {
    this.setState({research: event.nativeEvent.text});
  }

  updateListView(dataNewUser, action){
    if(action == "add"){
      this.listUserConnect.push({
        username: dataNewUser.name,
        userId: dataNewUser._id,
        userfirstname: dataNewUser.firstname,
        useremail: dataNewUser.email,
        isOnline : dataNewUser.isOnline,
      });
    }else if(action == "remove"){
      this.listUserConnect = this.listUserConnect.filter(obj => obj.userId !== dataNewUser.userId);
    }
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.listUserConnect),
    });
  }

  sendRequestResearch() {
    fetch(ServerConfig.url + 'users/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: this.state.research,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.valid){
        this.listUserConnect = [];
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listUserConnect),
        });
        responseJson.data.forEach(element => {
          this.updateListView(element, "add");
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
            alert("ich "+responseJson.message);
        }
      }
    })
    .catch((error) => {
      console.log("Error for the createUserProfil request "+ error);
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
            {`${rowData.isOnline}` === true &&
              <TouchableHighlight underlayColor='rgba(255, 255, 255, 0)' onPress={()=>{this.callUser(`${rowData.userId}`)}}>
                <Image
                  source={require('../../../img/Localiser.png')}
                  style={styles.call}
                />
              </TouchableHighlight>
            }
          </View>
        );
      }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Recherche d'amis"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="next"
            onChange={this.onResearchChanged.bind(this)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={true}
            style={styles.input}
          />
          <TouchableOpacity style={styles.researchButtonContainer} onPress={this.sendRequestResearch.bind(this)}>
              <Text style={styles.buttonText}> Rechercher </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listUserStyle}>
          <ListView
            style={{flex: 1}}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  searchBar: {
    flex: 0.30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  input: {
    flex: 1,
    backgroundColor : 'rgba(250,250,250,0.7)',
    color : '#000000',
    paddingHorizontal: 10,
    borderColor : 'rgba(0,0,0,0.3)',
    borderWidth : 0.5,
    textAlign: 'center'
  },
  researchButtonContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor : 'rgba(0,0,0,0.3)',
    borderWidth : 0.5,
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    textAlign : 'center',
    color : '#000000',
    opacity: 0.5,
    fontSize : 16
  },
  listUserStyle: {
    flex: 3,
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
