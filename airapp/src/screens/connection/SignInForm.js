import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text} from 'react-native';


export default class SignInForm extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
      userPassword: "",
      isFacebook: false,
    }
  }

  checkForEmptyField(){
    if(this.state.userEmail == "" || this.state.userPassword == ""){
      alert("Remplir les champs email et connexion");
    } else {
      this.isUserAlreadyRegistred();
    }
  }
  //Json form : {name: "chancla", firstname: "Risitas", email: "lachancla@hotmail.fr", _id:"zedzef4589"}
  isUserAlreadyRegistred(){
    fetch('http://172.16.14.80:3000/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.userEmail,
        password: this.state.userPassword,
        isFacebook: this.state.isFacebook
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      //valid //data //message //errors
      if(responseJson.valid){
        this.props.Parent.redirectionHome(responseJson.data);
      } else {
        switch(responseJson.code) {
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

  registrationView(){
    this.props.navigatorParent.push({
      screen: 'screens.Registration',
      title: "Inscription",
      backButtonTitle: 'Retour',
      passProps: {userEmail : this.state.userEmail, userPassword : this.state.userPassword},
    });
  }

  onEmailChanged(event) {
    this.setState({userEmail: event.nativeEvent.text});
  }

  onPasswordChanged(event) {
    this.setState({userPassword: event.nativeEvent.text});
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Adresse e-mail"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="next"
            onChange={this.onEmailChanged.bind(this)}
            onSubmitEditing = {() => this.passwordInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor='rgba(0,0,0,0.3)'
            returnKeyType="done"
            onChange={this.onPasswordChanged.bind(this)}
            secureTextEntry
            style={styles.input}
            ref={(input) => this.passwordInput = input}
          />
        </View>
        <View style={styles.buttonHolder}>
          <TouchableOpacity style={styles.buttonContainer} onPress= {this.checkForEmptyField.bind(this)}>
            <Text style={styles.buttonText}> Connexion </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerHorizontal}>
          <Text style={[styles.boxRegistration,styles.registerText]} onPress={this.registrationView.bind(this)}> Inscription </Text>
          <Text style={[styles.boxPipe,styles.registerText]}> | </Text>
          <Text style={[styles.boxPass,styles.mdpForgotten]} onPress = {()=> alert("Mot de passe oublié ? Pas de chance :)")}> Mot de passe oublié ? </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  input: {
    height : '30%',
    backgroundColor : 'rgba(250,250,250,0.7)',
    color : '#000000',
    marginBottom: '3%',
    paddingHorizontal: 10,
    borderColor : 'rgba(0,0,0,0.3)',
    borderWidth : 0.5,
    textAlign: 'center'
  },
  inputContainer: {
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingVertical: '3%',
  },
  buttonText: {
    textAlign : 'center',
    color : '#FFFFFF',
    fontSize : 18
  },
  buttonHolder: {
    backgroundColor : '#72A6FF',
  },
  containerHorizontal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  boxRegistration: {
    flex: 1,
  },
  boxPipe: {
    flex: 0.25,
  },
  boxPass: {
    flex: 1,
  },
  registerText: {
    fontSize: 15,
    textAlign: 'center',
  },
  mdpForgotten : {
    fontSize: 15,
    textAlign: 'center',
  }
});
