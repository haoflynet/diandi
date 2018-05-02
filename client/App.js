/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {StackNavigator} from 'react-navigation';
import { HomeScreen } from './views/home';
import { ProfileScreen } from './views/profile';

console.log(HomeScreen);

export default App = StackNavigator({
  Home: {screen: HomeScreen}
  Profile: {screen: ProfileScreen},
});

