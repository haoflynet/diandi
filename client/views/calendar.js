/**
 * 设置
 */
import React, { Component } from 'react';
import { View, Text, Button,StyleSheet } from 'react-native';
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
      markedDates:  {},
      items: {}
    };
    this.state.markedDates[this.state.currentDate.toString('yyyy-MM-dd')] = {selected: true, marked: true, selectedColor: '#00adf5'}
  };

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return null;
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  render() {
    return (
      <Agenda
        monthFormat={'yyyy年MM月'}
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2017-05-16'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        renderDay={(date, item) => {

          function sameDate(a, b) {
            return a instanceof XDate && b instanceof XDate &&
              a.getFullYear() === b.getFullYear() &&
              a.getMonth() === b.getMonth() &&
              a.getDate() === b.getDate();
          }

          const today = sameDate(date, XDate()) ? styles.today : undefined;
          console.log(date, item);
          if (date) {
            if (item) {
              return (
                <View style={styles.day}>
                  <Text allowFontScaling={false} style={[styles.dayNum, today]}>{date.day}</Text>
                  <Text allowFontScaling={false} style={[styles.dayText, today]}>{XDate.locales[XDate.defaultLocale].dayNamesShort[date.day]}</Text>
                </View>
              );
            }

          } else {
            return (
              <View style={styles.day}/>
            );
          }
        }}

        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
         // monthFormat={'yyyy'}
         // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />

      // </View>
    )
  }
}


const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  },
  day: {
    width: 63,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 32
  },
  dayNum: {
    fontSize: 28,
    fontWeight: '200',
    color: "#7a92a5"
  },
  dayText: {
    fontSize: 14,
    fontWeight: '300',
    color: "#7a92a5",
    marginTop: -5,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  today: {
    color: '#00adf5',
  },
});
