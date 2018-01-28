import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text} from 'react-native';


export default class SignInForm extends Component<{}> {

  constructor(props) {
    super(props);

    this.state = {
      userEmail: "",
      userPassword: "",
    }
  }

  checkForEmptyField(){
    if(this.state.userEmail == "" || this.state.userPassword == ""){
      this.registrationView();
    } else {
      this.isUserAlreadyRegistred();
    }
  }

  isUserAlreadyRegistred(){
    // fetch('http://localhost:4443/persons/connect/'+this.state.userEmail+'/'+this.state.userPassword)
    // .then((response) => response.json())
    // .then((responseJson) => {
    //   if(responseJson.connexion === undefined){
    //     //L'utilisateur est enregistre
    //     this.homeView(responseJson);
    //   } else if(responseJson.connexion == false && responseJson.info != undefined){
    //     //L'utilisateur n'existe pas, on le redirige vers l'ecran d'enregistrement
    //     alert(responseJson.info);
    //   } else {
    //     this.registrationView();
    //   }
    // })
    // .catch((error) => {
    //   console.log("Error for the UserAlreadyRegistred request " + error);
    // });
  }

  homeView(userData){
    // this.props.navigatorParent.showModal({
    //   screen: 'DIFM_App.Accueil',
    //   title: 'Accueil',
    //   passProps: {objUser : userData},
    // });
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
          <Text style={styles.mdpForgotten} onPress = {()=> console.log("mot de passe oublieeee")}> Mot de passe oublié? </Text>
        </View>
        <View style={styles.buttonHolder}>
          <TouchableOpacity style={styles.buttonContainer} onPress= {this.checkForEmptyField.bind(this)}>
            <Text style={styles.buttonText}> Inscription / Connexion </Text>
          </TouchableOpacity>
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
    marginBottom: '3%',
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
    justifyContent: 'flex-end',
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
  mdpForgotten : {
    fontSize: 10,
    marginBottom: '5%',
    textAlign: 'center'
  }
});
