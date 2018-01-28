import { Navigation } from 'react-native-navigation';

import ConnectionScreen from './connection/Connection';
import RegistrationScreen from './registration/Registration';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('screens.Connection', () => ConnectionScreen);
  Navigation.registerComponent('screens.Registration', () => RegistrationScreen);
}
