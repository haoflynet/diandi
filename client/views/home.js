/**
 * 首页
 */
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import { View, Text, Button, Image, StyleSheet, TouchableHighlight} from 'react-native';
import axios from 'axios';
import { API_VOICES, VOICE_TYPE_RECORD, VOICE_TYPE_ALARM } from '../utils/constants/config';


export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voices: [],
      text: '',
    }

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
