import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image
} from 'react-native';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class Home extends Component<{}> {

  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarComponentAlignment: 'center',
    navBarBackgroundColor: '#C0BAEF'
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../img/ALERTE.jpg')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  logo : {
    width : WIDTH_SCREEN*0.5,
    height : WIDTH_SCREEN*0.5,
  },
});
