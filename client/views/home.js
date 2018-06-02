/**
 * 首页
 */
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import { View, Text, Button, Image, StyleSheet, TouchableHighlight, TextInput, RefreshControl, ScrollView} from 'react-native';
import axios from 'axios';
import { API_VOICES, VOICE_TYPE_RECORD, VOICE_TYPE_ALARM } from '../utils/constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Timeline from 'react-native-timeline-listview';

export class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '点点记录',
    headerLeft: (<Icon name="user" size={24} color="#007AFF" onPress={() => navigation.navigate('Profile')} style={{marginLeft: 10}} />),
    headerRight: (<Icon name="calendar-o" size={24} color="#007AFF" onPress={() => navigation.navigate('Calendar')} value="10" style={{marginRight: 10}} />),
  });

  constructor(props) {
    super(props);

    this.state = {
      voices: [],
      text: '点击可直接输入',
      text_color: 'gray',
    }

    this.data = [
      {
        title: '我要成为一个很厉害的人', 
        icon: require('../img/record.png'),
      },
      {
        title: '下个月一定要完成这个项目', 
        icon: require('../img/alarm.png'),
      },
      {
        title: '明天八点起床', 
        icon: require('../img/fuzzy_alarm.png'),
      },
      {
        title: 'Watch Soccer', 
        icon: require('../img/record.png'),
      },
      {
        title: 'Go to Fitness center', 
        icon: require('../img/start.png'),
      }
    ];


    Voice.onSpeechPartialResults = this._onSpeechPartialResults.bind(this);
    Voice.onSpeechResults = this._onSpeechResults.bind(this);
  }

  componentDidMount() {
    axios.get(API_VOICES, {
      params: {
        type: VOICE_TYPE_RECORD
      }
    }).then((response) => {
      voices = response.data.data;
      this.setState({
        voices: voices,
      });
      console.log(voices);
    }).catch((error) => {
      console.log('error in home.componentDidMount');
    });
  }

  _onSpeechPartialResults(e) {
    console.log('onSpeechPartialResults');
    this.setState({
      text: e.value[0],
    });
    console.log(e.value);
  }

  _onSpeechResults(e) {
    console.log('onSpeechResults');
    console.log(e.value);
  }

  /**
   * 按钮按下开始录音
   * @param {*} e 
   */
  async _startRecognizing(e) {
    console.log('开始录音');
    this.setState({
      text: '',
      text_color: 'black',
    });

    if (!Voice.isAvailable()	) {
      console.error('没有录音权限');
    }

    try {
      await Voice.start('zh-Hans');
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 按钮松开结束录音
   * @param {*} e 
   */
  async _stopRecognizing(e) {
    console.log('结束录音');
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 添加记录
   */
  async _addRecord() {
    console.log('添加记录');
    axios.post(API_VOICES, {
      'text': this.state.text,
      'type': VOICE_TYPE_RECORD
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * 添加提醒
   */
  async _addAlarm() {
    console.log('添加提醒');
    axios.post(API_VOICES, {
      'text': this.state.text,
      'type': VOICE_TYPE_ALARM
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log('error');
      console.log(error);
    });
  }

  render() {
    return (
      <ScrollView style={{flex:1}}>
        <View>
          <TextInput
            style={{
              height: 40, 
              alignSelf: 'center',
              alignItems: 'center',
            }}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            color={this.state.text_color}
          />
        </View>

        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
        }}>
          <TouchableHighlight style={{
            position: 'absolute',
            zIndex: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }} onPressIn={this._startRecognizing.bind(this)} onPressOut={this._stopRecognizing.bind(this)}>
            <Icon name="microphone" size={70} color="black"
              style={{
                color: "#99A7F2",
                position: 'absolute',
                zIndex: 1,
            }} />
          </TouchableHighlight>


          <TouchableHighlight onPressIn={this._startRecognizing.bind(this)} onPressOut={this._stopRecognizing.bind(this)}>
            <Image
              style={{
                width: 250, 
                height: 250,
                alignItems: 'center',
                justifyContent:'center',
              }}
              source={require('../img/ball.png')}
            />
          </TouchableHighlight>
        </View>

        <View style={{
          flex: 1
        }}>
          <Timeline 
            style={styles.list}
            data={this.data}
            circleSize={20}
            circleColor='rgba(0,0,0,0)'
            lineColor='rgb(45,156,219)'
            timeContainerStyle={{minWidth:52, marginTop: -5}}
            timeStyle={{textAlign: 'center', color:'white', padding:5, borderRadius:13}}
            descriptionStyle={{color:'gray'}}
            options={{
              style:{paddingTop:5}
            }}
            innerCircle={'icon'}
            onEventPress={this.onEventPress}                    
            separator={false}
            detailContainerStyle={{marginBottom: 20, paddingLeft: 5, paddingRight: 5, backgroundColor: "#BBDAFF", borderRadius: 10}}
            columnFormat='two-column'
        />
        </View>

        <TouchableHighlight onPressIn={this._startRecognizing.bind(this)} onPressOut={this._stopRecognizing.bind(this)}>
        <Icon name="microphone" size={70} color="black" onPress={this._startRecognizing.bind(this)}
              style={{
                color: "black",
                position: 'absolute',
                zIndex: 1,
          }} />
        </TouchableHighlight>
        
        {this.state.voices.map((voice, index) => {
          return (
            <Text
              key={`voice-${voice.id}`}>
              {voice.text}
            </Text>
          )
        })}      
      </ScrollView>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
	paddingTop:65,
    backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
  title:{
    fontSize:16,
    fontWeight: 'bold'
  },
  descriptionContainer:{
    flexDirection: 'row',
    paddingRight: 50
  },
  image:{
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textDescription: {
    marginLeft: 10,
    color: 'gray'
  }
});