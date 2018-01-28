/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  Text,
  View,
  Animated,
  Keyboard,
  TouchableOpacity
} from 'react-native';

import SignInForm from './SignInForm';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

// const FBSDK = require('react-native-fbsdk');
// const {
//   LoginManager,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } = FBSDK;

export default class Connection extends Component<{}> {

  constructor(props) {
    super(props);

    //Hide the top navbar
    this.props.navigator.toggleNavBar({
      to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
      animated: true // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
    });
    this.keyboardHeight = new Animated.Value(0);
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    // LoginManager.logOut();
    // AccessToken.getCurrentAccessToken().then(
    //   (data) => {
    //     if(data)
    //       this.getUserFBData();
    //   }
    // );
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

  //Handle the facebook connection here
  handleFacebookLogin(){
    // LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
    //   (result) => {
    //     if(result.isCancelled){
    //       alert('Connexion Facebook annulée');
    //     } else {
    //       this.getUserFBData();
    //     }
    //   },
    //   function(error) {
    //     alert('Erreur de la connexion Facebook: '+ error);
    //   }
    // );
  };

  getUserFBData() {
    // let infoRequest = new GraphRequest(
    //   '/me?fields=last_name,first_name,email',
    //   null,
    //   this.responseInfoCallback
    // );
    // new GraphRequestManager().addRequest(infoRequest).start();
  }

  responseInfoCallback = (error, result) => {
    // if(error) {
    //   alert('Erreur lors de la reception des informations facebook: '+ error);
    // } else {
    //   alert('Reception des informations utilisateur, prenom: '+ result.first_name + ' nom: '+ result.last_name + ' email: ' + result.email)
    //   //this.setState({});
    // }
  }

  render() {
    return (
      <Animated.View behavior="position"
      style={[styles.container,{ paddingBottom: this.keyboardHeight }]} >
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../img/KdoubleRotor.png')}
          />
          <Text style={styles.welcome}> Bienvenue sur Air Finder !</Text>
          <Text style={styles.infoMsg}> Connectez-vous ou inscrivez-vous pour commencer</Text>
        </View>
        <View style={styles.FBform}>
          <TouchableOpacity style={styles.buttonContainer} onPress={this.handleFacebookLogin.bind(this)}>
              <Text style={styles.buttonText}> Connexion Facebook </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.line]}/>
        <View style={styles.form}>
          <SignInForm navigatorParent={this.props.navigator}/>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#EDEDED', //EDEDED,
  },
  logoContainer : {
    alignItems : 'center',
    flex : 1.5,
    justifyContent : 'flex-end',
    // marginBottom: '5%'
  },
  logo : {
    width : WIDTH_SCREEN*0.5,
    height : WIDTH_SCREEN*0.5,
  },
  FBform : {
    height: HEIGHT_SCREEN*0.15,
    justifyContent : 'center',
  },
  welcome : {
    color : 'black',
    fontWeight : 'bold',
    marginTop : '5%'
  },
  infoMsg : {
    color : 'black',
    marginTop : '3%',
    fontSize : 11,
    opacity: 0.7,
  },
  buttonContainer: {
    paddingVertical: '3%',
    backgroundColor: '#3B5998',
  },
  buttonText: {
    textAlign : 'center',
    color : '#FFFFFF',
    fontSize : 18
  },
  form : {
    height: HEIGHT_SCREEN*0.4,
  },
  line : {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    width: '80%',
    marginLeft: '10%',
  }
});
