/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import {StackNavigator} from 'react-navigation';
import { HomeScreen } from './views/home';
import { ProfileScreen } from './views/profile';
import { CalendarScreen } from './views/calendar';
import { TestScreen } from './views/test';


export default App = StackNavigator({
  Test: {screen: TestScreen},

  Home: {screen: HomeScreen},


  Calendar: {screen: CalendarScreen},
  Profile: {screen: ProfileScreen},

});

