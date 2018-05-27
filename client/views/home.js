/**
 * 首页
 */
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import { View, Text, Button, Image, StyleSheet, TouchableHighlight, TextInput, RefreshControl} from 'react-native';
import axios from 'axios';
import { API_VOICES, VOICE_TYPE_RECORD, VOICE_TYPE_ALARM } from '../utils/constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Timeline from 'react-native-timeline-listview';


export class HomeScreen extends Component {
  static navigationOptions = {
    title: '点点记录',
    headerLeft: (
      <Button 
        onPress={() => alert('个人中心暂未开放')}
        title="个人"
      />
    ),
    headerRight: (
      <Button
        onPress={() => alert('日历系统暂未开放')}
        title="日历"
      />
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      voices: [],
      text: '点击可直接输入',
    }

    this.data = [
      {
        title: '我要成为一个很厉害的人', 
        lineColor:'#009688', 
        icon: require('../img/archery.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg'
      },
      {
        title: '下个月一定要完成这个项目', 
        icon: require('../img/badminton.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg'
      },
      {
        title: '明天八点起床', 
        icon: require('../img/lunch.png'),
      },
      {
        title: 'Watch Soccer', 
        lineColor:'#009688', 
        icon: require('../img/soccer.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg'
      },
      {
        title: 'Go to Fitness center', 
        icon: require('../img/dumbbell.png'),
        imageUrl: 'https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg'
      }
    ]

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
      text: ''
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
      <View>
        <TouchableHighlight onPressIn={this._startRecognizing.bind(this)} onPressOut={this._stopRecognizing.bind(this)}>
          <View>
            <Text>开始录音</Text>
	        </View>
        </TouchableHighlight>

        <TouchableHighlight onPressIn={this._addRecord.bind(this)}>
          <View>
            <Text>添加记录</Text>
	        </View>
        </TouchableHighlight>

        <TouchableHighlight onPressIn={this._addAlarm.bind(this)}>
          <View>
            <Text>添加提醒</Text>
          </View>
        </TouchableHighlight>
        
        {this.state.voices.map((voice, index) => {
          return (
            <Text
              key={`voice-${voice.id}`}>
              {voice.text}
            </Text>
          )
        })}      
      </View>
    );
  };
};
