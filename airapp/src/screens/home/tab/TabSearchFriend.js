import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class TabSearchFriend extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      research: "",
    }
  }

  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarComponentAlignment: 'center',
    navBarBackgroundColor: '#C0BAEF'
  };

  onResearchChanged(event) {
    this.setState({research: event.nativeEvent.text});
  }

  sendRequestResearch() {
    alert("isse");
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
  }
});
