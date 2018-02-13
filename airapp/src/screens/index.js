import { Navigation } from 'react-native-navigation';

import ConnectionScreen from './connection/Connection';
import RegistrationScreen from './registration/Registration';
import HomeScreen from './home/Home';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('screens.Connection', () => ConnectionScreen);
  Navigation.registerComponent('screens.Registration', () => RegistrationScreen);
  Navigation.registerComponent('screens.Home', () => HomeScreen);
}
