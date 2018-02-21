import { Navigation } from 'react-native-navigation';

import ConnectionScreen from './connection/Connection';
import RegistrationScreen from './registration/Registration';

import HomeScreen from './home/Home';
import UserInfoScreen from './home/UserInfo';
import TabOnlineFriendScreen from './home/tab/TabOnlineFriend';
import TabOfflineFriendScreen from './home/tab/TabOfflineFriend';
import TabSearchFriendScreen from './home/tab/TabSearchFriend';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('screens.Connection', () => ConnectionScreen);

  Navigation.registerComponent('screens.Registration', () => RegistrationScreen);

  Navigation.registerComponent('screens.Home', () => HomeScreen);
  Navigation.registerComponent('screens.UserInfo', () => UserInfoScreen);
  Navigation.registerComponent('screens.TabOnlineFriend', () => TabOnlineFriendScreen);
  Navigation.registerComponent('screens.TabOfflineFriend', () => TabOfflineFriendScreen);
  Navigation.registerComponent('screens.TabSearchFriend', () => TabSearchFriendScreen);


}
