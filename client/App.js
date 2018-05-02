/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {StackNavigator} from 'react-navigation';
import { HomeScreen } from './views/home';

console.log(HomeScreen);

export default App = StackNavigator({
  Home: {screen: HomeScreen}
});

