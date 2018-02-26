import React, { Component } from 'react';
import ServerConfig from '../../../config/server-config';
import Socket from '../socket/Socket';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
} from 'react-native';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class TabOfflineFriend extends Component<{}> {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    this.listUserConnect = [];
    Socket.set_OfflineFriend(this);
    this.socket = new Socket();
  }
  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarComponentAlignment: 'center',
    navBarBackgroundColor: '#C0BAEF'
  };

  componentDidMount() {
    console.log("mout offline");
    this.fillListHistory();
  }

  searchPerson(id, action) {
    if(id !== this.props.objUser._id){
      fetch(ServerConfig.url + 'users/search/custom', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: id,
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.valid){
          responseJson.data.forEach(element => {
            this.updateListView(element, action);
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
          }
        }
      })
      .catch((error) => {
        console.log("Error for the createUserProfil request "+ error);
      });
    }
  }

  fillListHistory(){
    fetch(ServerConfig.url + 'users/search/custom', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isOnline: false,
        _id: {$ne: this.props.objUser._id},
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
        }
      }
    })
    .catch((error) => {
      console.log("Error for the createUserProfil request "+ error);
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
