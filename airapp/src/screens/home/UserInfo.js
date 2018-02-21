import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ListView
} from 'react-native';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class UserInfo extends Component<{}> {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
    this.listHistory = [];
  }

  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarComponentAlignment: 'center',
    navBarBackgroundColor: '#C0BAEF'
  };

  //Request server and fill the list
  fillListHistory(){
    for(let i = 0; i < 5; i++){
      this.listHistory.push({
        date: "20/02/2018",
        person: "Risitas",
        status: "Terminé",
      });
    }
    this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.listHistory),
    });
  }

  componentDidMount() {
    this.fillListHistory();
  }


  //Edit User Name - first name
  handleEdit(){
    alert('ayaaaaaa');
  };

  renderRow(rowData){
        return (
          <View style={styles.listV}>
            <View style={styles.listVBox1}>
              <Text style={styles.paramTitle}>
                {`${rowData.person}`}
              </Text>
              <Text style={styles.paramValue}>
                {`${rowData.status}`}
              </Text>
            </View>
            <View style={styles.listVBox2}>
              <Text style={styles.paramValue}>
                {`${rowData.date}`}
              </Text>
              <TouchableHighlight underlayColor='rgba(255, 255, 255, 0)' onPress={()=>{this.handleEdit.bind(this)}}>
                <Image
                  source={require('../../img/info.png')}
                  style={styles.call}
                />
              </TouchableHighlight>
            </View>
          </View>
        );
      }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imgBox}>
          <Image
            style={styles.logo}
            source={require('../../img/userImg.png')}
          />
        </View>
        <View style={styles.usrTextBox}>
          <View style={styles.userTextContainer}>
            <Text style={styles.titleText}> Information: </Text>
          </View>
          <TouchableOpacity style={styles.userButtonContainer} onPress={this.handleEdit.bind(this)}>
              <Text style={styles.buttonText}> Editer </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoBoxes}>
          <View style={styles.infoBox}>
            <Text style={styles.paramTitle}> Email: </Text>
            <Text style={styles.paramValue}> {this.props.objUser.email}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.paramTitle}> Nom: </Text>
            <Text style={styles.paramValue}> {this.props.objUser.name}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.paramTitle}> Prenom: </Text>
            <Text style={styles.paramValue}> {this.props.objUser.firstname}</Text>
          </View>
        </View>
        <View style={styles.usrTextBox}>
          <View style={styles.userTextContainer}>
            <Text style={styles.titleText}> Historique: </Text>
          </View>
        </View>
        <View style={styles.historiqueBox}>
          <ListView
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
    flexDirection: 'column',
    backgroundColor : '#EDEDED',
    justifyContent: 'center',
  },
  imgBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo : {
    width : WIDTH_SCREEN*0.5,
    height : WIDTH_SCREEN*0.5,
  },
  usrTextBox : {
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#2c2f33'
  },
  userTextContainer: {
    flex: 1,
  },
  userButtonContainer: {
    flex: 0.25,
    backgroundColor: '#7289da',
  },
  buttonText: {
    textAlign : 'center',
    color : '#FFFFFF',
    fontSize : 18
  },
  infoBoxes: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#99aab5',
  },
  infoBox: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  historiqueBox: {
    flex: 6,
    flexDirection: 'column',
    backgroundColor: '#99aab5',
  },
  titleText: {
    color : '#FFFFFF',
    fontSize : 20
  },
  paramTitle: {
    color : '#23272a',
    fontWeight: 'bold',
    fontSize : 18
  },
  paramValue: {
    color : '#23272a',
    fontSize : 16
  },
  call: {
    height: 40,
    width: 40,
  },
  listV: {
    flex: 1,
    flexDirection: 'row',
  },
  listVBox1: {
    flex: 1,
  },
  listVBox2: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
    opacity: 0.4,
    marginLeft: StyleSheet.hairlineWidth + 60
  }
});
