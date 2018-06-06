/**
 * 设置
 */
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import XDate from 'xdate';


export class CalendarScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '日历',
    headerLeft: (<Icon name="chevron-left" size={30} color="#007AFF" onPress={() => navigation.navigate('Home')} style={{marginLeft: 10}} />),
  });

  constructor(props) {
    super(props);
    
    this.state = {
      currentDate: new XDate(),
      markedDates:  {}
    };
    this.state.markedDates[this.state.currentDate.toString('yyyy-MM-dd')] = {selected: true, marked: true, selectedColor: '#00adf5'}
  };

  render() {
    return (
      <View>
        <CalendarList
          onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
          pastScrollRange={50}
          futureScrollRange={50}
          scrollEnabled={true}
          showScrollIndicator={true}

          minDate={'2018-01-01'}
          onDayPress={(day) => {console.log('selected day', day)}}
          monthFormat={'yyyy年MM月'}

          markedDates = {this.state.markedDates}
        />
        <Agenda
          // the list of items that have to be displayed in agenda. If you want to render item as empty date
          // the value of date key kas to be an empty array []. If there exists no value for date key it is
          // considered that the date in question is not yet loaded
          items={
            {'2018-06-02': [{text: 'item 1 - any js object'}],
            '2012-05-23': [{text: 'item 2 - any js object'}],
            '2012-05-24': [],
            '2012-05-25': [{text: 'item 3 - any js object'},{text: 'any js object'}],
            }}
          // callback that gets called when items for a certain month should be loaded (month became visible)
          loadItemsForMonth={(month) => {console.log('trigger items loading')}}
          // callback that fires when the calendar is opened or closed
          onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
          // callback that gets called on day press
          onDayPress={(day)=>{console.log('day pressed')}}
          // callback that gets called when day changes while scrolling agenda list
          onDayChange={(day)=>{console.log('day changed')}}
          // initially selected day
          selected={'2012-05-16'}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2012-05-10'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2012-05-30'}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => {return (<View />);}}
          // specify how each date should be rendered. day can be undefined if the item is not first in that day.
          renderDay={(day, item) => {return (<View />);}}
          // specify how empty date content with no items should be rendered
          renderEmptyDate={() => {return (<View />);}}
          // specify how agenda knob should look like
          renderKnob={() => {return (<View />);}}
          // specify what should be rendered instead of ActivityIndicator
          renderEmptyData = {() => {return (<View />);}}
          // specify your item comparison function for increased performance
          rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
          // Hide knob button. Default = false
          hideKnob={true}
          // By default, agenda dates are marked if they have at least one item, but you can override this if needed
          markedDates={{
            '2012-05-16': {selected: true, marked: true},
            '2012-05-17': {marked: true},
            '2012-05-18': {disabled: true}
          }}
          // agenda theme
          // theme={{
          //   ...calendarTheme,
          //   agendaDayTextColor: 'yellow',
          //   agendaDayNumColor: 'green',
          //   agendaTodayColor: 'red',
          //   agendaKnobColor: 'blue'
          // }}
          // agenda container style
          style={{}}
        />    
      </View>
    )
  }
}