import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const HEIGHT_SCREEN = Dimensions.get('window').height;

export default class Registration extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      userFirstName : "",
      userName : "",
      userEmail : this.props.userEmail,
      userPassword : this.props.userPassword,
      userPasswordConfirm : "",
      isFacebook : false,
    };
    this.keyboardHeight = new Animated.Value(0);
    //Fait disparaitre la barre de navigation du bas
    this.props.navigator.toggleTabs({
      to: 'hidden', // required, 'hidden' = hide tab bar, 'shown' = show tab bar
    });
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
    this.justifyContentTextInput = 'flex-start';
  };

  keyboardDidHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: 400,
        toValue: 0,
      }),
    ]).start();
    this.justifyContentTextInput = 'center';
  };

  onNameChanged(event) {
    this.setState({userName: event.nativeEvent.text});
  }

  onFirstNameChanged(event) {
    this.setState({userFirstName: event.nativeEvent.text});
  }

  onEmailChanged(event) {
    this.setState({userEmail: event.nativeEvent.text});
  }

  onPasswordChanged(event) {
    this.setState({userPassword: event.nativeEvent.text});
  }

  onPasswordConfirmChanged(event) {
    this.setState({userPasswordConfirm: event.nativeEvent.text});
  }

  onFormValidation() {
    if(this.checkForField() && this.checkForSamePassword() && this.checkFormEmail()){ this.createUserProfil()}
    else{console.log("Something went wrong...");}
  }

  createUserProfil() {
    fetch('http://172.16.14.105:3000/users/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.userName,
        firstname: this.state.userFirstName,
        email: this.state.userEmail,
        password: this.state.userPassword,
        isFacebook: this.state.isFacebook
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.valid){
        thisprops.connection.redirectionHome(responseJson.data);
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

  checkForField() {
    if(this.state.userName == "") {alert('Merci de remplir le champ Nom'); return false;}
    else if(this.state.userFirstName == "") {alert('Merci de remplir le champ Prénom'); return false;}
    else if(this.state.userEmail == "") {alert('Merci de remplir le champ Email'); return false;}
    else if(this.state.userPassword == "") {alert('Merci de remplir le champ Mot de passe'); return false;}
    else if(this.state.userPasswordConfirm == "") {alert('Merci de remplir le champ Confirmation mot de passe'); return false;}
    return true;
  }

  checkForSamePassword() {
    if(this.state.userPassword == this.state.userPasswordConfirm) { return true;}
    else { alert("Merci de rentrer deux mots de passe identique"); return false;}
  }

  checkFormEmail() {
    let regexMail =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(regexMail.test(this.state.userEmail)){ return true;}
    else { alert('Email non valid'); return false;}
  }

  render() {
    return(
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.subContainer1}>
          <TextInput
            placeholder="Nom"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="next"
            value = {this.state.userName}
            onChange={this.onNameChanged.bind(this)}
            onSubmitEditing = {() => this.nicknameInput.focus()}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <TextInput
            placeholder="Prénom"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="next"
            value = {this.state.userFirstName}
            onChange={this.onFirstNameChanged.bind(this)}
            onSubmitEditing = {() => this.nameInput.focus()}
            autoCapitalize="none"
            ref={(input) => this.nicknameInput = input}
            autoCorrect={false}
            style={styles.input}
          />
          <TextInput
            placeholder="Adresse e-mail"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="next"
            value = {this.state.userEmail}
            onChange={this.onEmailChanged.bind(this)}
            onSubmitEditing = {() => this.passwordInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            ref={(input) => this.nameInput = input}
            autoCorrect={false}
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="next"
            value = {this.state.userPassword}
            onChange={this.onPasswordChanged.bind(this)}
            onSubmitEditing = {() => this.passwordInputConf.focus()}
            autoCapitalize="none"
            secureTextEntry
            ref={(input) => this.passwordInput = input}
            autoCorrect={false}
            style={styles.input}
          />
          <TextInput
            placeholder="Confirmation mot de passe"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="done"
            value = {this.state.userPasswordConfirm}
            onChange={this.onPasswordConfirmChanged.bind(this)}
            secureTextEntry
            style={styles.input}
            ref={(input) => this.passwordInputConf = input}
          />
        </View>
        <View style={styles.subContainer2}>
          <View style={styles.buttonHolder}>
            <TouchableOpacity style={styles.buttonContainer} onPress={this.onFormValidation.bind(this)}>
              <Text style={styles.buttonText}> Valider </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor : '#EDEDED',
  },
  container2: {
    backgroundColor : 'red',
  },
  subContainer1: {
    flex: 3,
    justifyContent: 'center',
  },
  subContainer2: {
    flex: 0.5,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  input: {
    height: HEIGHT_SCREEN*0.08,
    backgroundColor : 'rgba(250,250,250,0.7)',
    color : '#000000',
    marginBottom: '3%',
    paddingHorizontal: 10,
    borderColor : 'rgba(0,0,0,0.3)',
    borderWidth : 0.5,
    textAlign: 'center'
  },
  buttonContainer: {
    paddingVertical: '3%',
  },
  buttonText: {
    textAlign : 'center',
    color : '#FFFFFF',
    fontWeight: 'bold',
    fontSize : 18
  },
  buttonHolder: {
    backgroundColor : '#72A6FF',
    flex: 0.1,
    justifyContent: 'center',
  },
});
