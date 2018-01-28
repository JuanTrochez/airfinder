import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Keyboard,
  TouchableOpacity
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class Registration extends Component<{}> {

  constructor(props) {
    super(props);

    this.keyboardHeight = new Animated.Value(0);
  }

  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarBackgroundColor: '#C0BAEF'
  };

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  };

  keyboardDidShow = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: 400,
        toValue: event.endCoordinates.height,
      }),
    ]).start();
  };

  keyboardDidHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: 400,
        toValue: 0,
      }),
    ]).start();
  };

  render() {
    return(
      <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      resetScrollToCoords={{x : 0, y : 0}}
      >

      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : '#EDEDED',
  },
});
