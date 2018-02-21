import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens';

registerScreens(); // this is where you register all of your app's screens
console.disableYellowBox = true;
Navigation.startSingleScreenApp({
  screen: {
    screen: 'screens.Connection', // unique ID registered with Navigation.registerScreen
  }
});
