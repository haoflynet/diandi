/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import {StackNavigator} from 'react-navigation';
import { HomeScreen } from './views/home';
import { ProfileScreen } from './views/profile';
import { CalendarScreen } from './views/calendar';


export default App = StackNavigator({
  Home: {screen: HomeScreen},
  Calendar: {screen: CalendarScreen},
  Profile: {screen: ProfileScreen},
});

