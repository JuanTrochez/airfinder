import React, { Component } from 'react';
import ServerConfig from '../../config/server-config';
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

import { Navigation } from 'react-native-navigation';
import SignInForm from './SignInForm';

const WIDTH_SCREEN = Dimensions.get('window').width;
const HEIGHT_SCREEN = Dimensions.get('window').height;

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

export default class Connection extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      userFirstName : "",
      userName : "",
      userEmail : this.props.userEmail,
      userPassword : this.props.userPassword,
      isFacebook : false,
    };
    //Hide the top navbar
    this.props.navigator.toggleNavBar({
      to: 'hidden', // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
      animated: true // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
    });
    this.keyboardHeight = new Animated.Value(0);
  }

  static navigatorStyle = {
    drawUnderTabBar: true,
    navBarButtonColor: '#ffffff',
    navBarTextColor: '#ffffff',
    collapsingToolBarCollapsedColor: '#0f2362',
    navBarBackgroundColor: '#eeeeee'
  };

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    LoginManager.logOut();
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        if(data)
          this.getUserFBData();
      }
    );
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
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      (result) => {
        if(result.isCancelled){
        } else {
          this.getUserFBData();
        }
      },
      function(error) {
        alert('Erreur de la connexion Facebook: '+ error);
      }
    );
  };

  sendFBCreatePerson() {
    fetch(ServerConfig.url + 'users/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.userName,
        firstname: this.state.userFirstName,
        email: this.state.userEmail,
        isFacebook: this.state.isFacebook
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.valid){
        this.redirectionHome(responseJson.data);
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
    })
    .catch((error) => {
      console.log("Error for the createUserProfil request "+ error);
    });
  }

  sendFBConnection() {
    fetch(ServerConfig.url + 'users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.userName,
        firstname: this.state.userFirstName,
        email: this.state.userEmail,
        isFacebook: this.state.isFacebook
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.valid){
        this.redirectionHome(responseJson.data);
      } else {
        switch(responseJson.code) {
          case "CREATE_FB_ACCOUNT":
            this.sendFBCreatePerson();
            break;
          case "DISPLAY_MESSAGE":
            alert(responseJson.message);
            break;
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
    })
    .catch((error) => {
      console.log("Error for the createUserProfil request "+ error);
    });
  }

  getUserFBData() {
    let infoRequest = new GraphRequest(
      '/me?fields=last_name,first_name,email',
      null,
      this.responseInfoCallback
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  responseInfoCallback = (error, result) => {
    if(error) {
      console.log('Erreur lors de la reception des informations facebook: '+ error);
    } else {
      this.setState({userName: result.last_name, userFirstName: result.first_name, userEmail: result.email, isFacebook: true});
      this.sendFBConnection();
    }
  }

  redirectionHome(userData){
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'screens.Home',
        title: 'Accueil',
        passProps: {objUser : userData},
        topTabs: [{
          screenId: 'screens.TabOnlineFriend',
          title: 'En ligne',
          passProps: {objUser : userData, navigatorParent: this.props.navigator},
        }, {
          screenId: 'screens.TabOfflineFriend',
          title: 'Hors Ligne',
        }, {
          screenId: 'screens.TabSearchFriend',
          title: 'Recherche d amis',
        }],
      },
      drawer: {
        left: {
          // optional, define if you want a drawer from the left
          screen: 'screens.UserInfo', // unique ID registered with Navigation.registerScreen
          passProps: {objUser : userData}, // simple serializable object that will pass as props to all top screens (optional)
          disableOpenGesture: false, // can the drawer be opened with a swipe instead of button (optional, Android only)
          fixedWidth: WIDTH_SCREEN *2.5 // a fixed width you want your left drawer to have (optional)
        },
      },
    });
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
          <SignInForm navigatorParent={this.props.navigator} Parent={this}/>
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
