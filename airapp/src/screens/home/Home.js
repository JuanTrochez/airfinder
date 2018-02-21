import React, { Component } from 'react';
import {PixelRatio, Dimensions, StyleSheet, View} from 'react-native';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class Home extends Component<{}> {

  static navigatorStyle = {
    navBarTitleTextCentered: true,
    navBarBackgroundColor: '#C0BAEF',

    topTabTextColor: '#ffffff',
    topTabTextFontFamily: 'Bold',
    selectedTopTabTextColor: '#ff505c',

    // Icons
    topTabIconColor: '#ffffff',
    selectedTopTabIconColor: '#ff505c',

    // Tab indicator
    selectedTopTabIndicatorHeight: PixelRatio.get() * 2,
    selectedTopTabIndicatorColor: '#ff505c',
  };

  render() {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
