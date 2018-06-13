/**
 * home page
 */
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import { View, Text, Image, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, TextInput, RefreshControl, ScrollView, Animated} from 'react-native';
import axios from 'axios';
import { API_VOICES, VOICE_TYPE_RECORD, VOICE_TYPE_ALARM, VOICE_TYPE_IMG } from '../utils/constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Timeline from 'react-native-timeline-listview';
import Dimensions from 'Dimensions';
import RadialMenu from 'react-native-radial-menu';
import { Button } from 'react-native-elements';

const imgSource = require('../img/record.png');
const startImg = require('../img/start.png');


export class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => {
    let day = (new Date()).getDate();
    return {
      title: '点滴记录',
      headerLeft: (<Icon name="user" size={24} color="#007AFF" onPress={() => navigation.navigate('Profile')} style={{left: 10}} />),
      headerRight: (
        <View style={styles.centerContainer}>
          <Text onPress={() => navigation.navigate('Calendar')} style={[styles.centerContainer, {
                position: 'absolute',
                zIndex: 1,
                top: 7,
                right: day > 9 ? 14 : 17,
                color: '#007AFF'
          }]}>{day}</Text>
          <Icon name="calendar-o" size={24} color="#007AFF" onPress={() => navigation.navigate('Calendar')} value="10" style={[styles.centerContainer, {
            right: 10,
          }]} 
          />
        </View>),
    }
  };

  constructor(prop) {
    super(prop);

    this.state = {
      // other
      text: '',
      imageComponent: null,
      menuOpacity: 0,   // 菜单透明度
      scrollEnabled: true,  // 是否允许滚动
      // for timeline
      voices: [],
      datas: [],
      //for circle
      ripple:3,               // 同时存在的圆数量
      initialDiameter:0,      // 初始直径为0的时候才不会在初始化时被看到(最小那个圆的直径，图片固定250，这里固定230)
      endDiameter:375,        // 最大圆的直径，屏幕的宽度
      initialPosition:{top:125,left:187.5}, // 圆的定位(left是圆心，top是最上面的边)
      intervals: 500,         // 间隔时间
      spreadSpeed:2000,      //扩散速度
      anim: [],               // 点，只初始化一次
      cancelAnimated: false,  // 是否取消动画
      animatedFun: null,      // 动画函数，用于开始与停止动画
    }
    // 初始化circle
    let rippleArr = [];
    for(let i=0;i<this.state.ripple;i++) rippleArr.push(0);
    this.state.anim = rippleArr.map(()=> new Animated.Value(0));
    // bind this
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  componentDidMount() {
    axios.get(API_VOICES, {
      params: {
        type: VOICE_TYPE_RECORD
      }
    }).then((response) => {
      voices = response.data.data;
      datas = voices.map((voice) => {
        return {
          title: voice.text,
          icon: imgSource,
        };
      });

      if (response.data.paginator && voices.length < response.data.paginator.per_page) {
        datas.push({
          title: '',
          icon: startImg,
        });
      }

      this.setState({
        voices: voices,
        datas: datas,
      });
      console.log('home.componentDidMount ok');
    }).catch((error) => {
      console.log('error in home.componentDidMount');
      console.log(error);
    });
  }

  /**
   * 开始circle动画
   */
  startAnimation(){
    this.state.anim.map((val,index)=>val.setValue(0));
    this.state.animatedFun = Animated.stagger(this.state.intervals,this.state.anim.map((val)=>{
      return Animated.timing(val,{toValue:1,duration:this.state.spreadSpeed})
    }));
    this.state.cancelAnimated = false;
    this.state.animatedFun.start(()=>{if(!this.state.cancelAnimated) {this.startAnimation()}});
  }

  /**
   * 停止circle动画
   */
  stopAnimation(){
    this.state.cancelAnimated = true;
    this.state.animatedFun.stop();
    this.state.anim.map((val,index)=>val.setValue(0));
  }

  onSpeechPartialResults(e) {
    console.log('onSpeechPartialResults');
    console.log(e.value);
    this.setState({
      text: e.value[0],
    });
  }

  onSpeechResults(e) {
    console.log('onSpeechResults: no action');
  }

  /**
   * 主屏幕按钮按下: 开始录音、显示菜单、禁止滚动
   */
  async startRecognizing(e) {
    console.log('startRecognizing');
    if (!Voice.isAvailable()	) {
      console.error('没有录音权限');
    }

    // locate circle
    this.state.imageComponent.measure( (fx, fy, width, height, left, top) => {
      this.setState({
        menuOpacity: 100,
        text: '',
        scrollEnabled: false,
        initialDiameter: 230,
        endDiameter: Dimensions.get('window').width,
        initialPosition: {
          top: 125,    // 图片直径/2
          left: left + width / 2,
        }
      });
    });  
    this.startAnimation();

    try {
      await Voice.start('zh-Hans');
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 结束录音
   */
  async stopRecognizing(e) {
    console.log('stopRecognizing');
    this.stopAnimation();
    this.setState({      
      menuOpacity: 0,
      scrollEnabled: true
    });
    
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

  onSelectMenu(name) {
    console.log('select' + name);
    if (name == '搜索记录') {
      this.props.navigation.push('Calendar');
    } else if (name == '日常记录') {
      this._addRecord();
    } else if (name == '添加提醒') {
      this._addAlarm;
    }
  }

  render() {
    let r = this.state.endDiameter-this.state.initialDiameter;    // 直径变化量,top与left的变化是直径的一半
    let rippleComponent = this.state.anim.map((val,index)=>{
      return (
        <Animated.View key={"animatedView_"+index} style={[styles.spreadCircle,{backgroundColor:'#5BC6AD'},{
          opacity:val.interpolate({
                      inputRange:[0,1],
                      outputRange:[1,0]
                  }),
          height:val.interpolate({
                      inputRange:[0,1],
                      outputRange:[this.state.initialDiameter,this.state.endDiameter]
                  }),
          width:val.interpolate({
                      inputRange:[0,1],
                      outputRange:[this.state.initialDiameter,this.state.endDiameter]
                  }),
          top:val.interpolate({
                      inputRange:[0,1],
                      outputRange:[this.state.initialPosition.top - this.state.initialDiameter/2,this.state.initialPosition.top - this.state.initialDiameter/2 - r/2]
                  }),
          left:val.interpolate({
                      inputRange:[0,1],
                      outputRange:[this.state.initialPosition.left - this.state.initialDiameter/2,this.state.initialPosition.left - this.state.initialDiameter/2 - r/2]
                  }),
          }]}>
        </Animated.View>
      )
    });

    return (          
      <ScrollView style={{flex:1}} scrollEnabled={this.state.scrollEnabled}>
        <View style={{ flex: 1, flexDirection:'row'}}>
          <TextInput
            style={{
              flex: 1,
              height: 40, 
              alignSelf: 'center',
              textAlign: 'center',
              alignItems: 'center',
            }}
            placeholder='点击可直接输入'
            value={this.state.text}
          />
        </View>

        <View>{rippleComponent} </View>

        <View style={styles.centerContainer}>
          <TouchableWithoutFeedback 
            onPressIn={this.startRecognizing.bind(this)} 
            onPressOut={this.stopRecognizing.bind(this)}
            style={styles.centerContainer} >
              <View style={styles.centerContainer}>
                <View style={[styles.centerContainer, { position: 'absolute', zIndex: 1 }]}>
                  <RadialMenu
                    onOpen ={ this.startRecognizing.bind(this) }
                    onClose={ this.stopRecognizing.bind(this) }
                    menuRadius={95}
                    spreadAngle={360}
                    startAngle={30}
                    style={styles.centerContainer} 
                    >
                      <View style={styles.centerContainer}>
                        <Icon name="microphone" size={70} color="black" style={{ color: "#99A7F2", position: 'absolute' }} />
                      </View>
                      {['添加提醒', '日常记录', '查询记录'].map((name, i) => {
                        return  (
                          <View 
                            style={[styles.centerContainer, { opacity: this.state.menuOpacity }]} 
                            key={i}
                            onSelect={() => this.onSelectMenu(name)}
                            >
                            <Button
                              titleStyle={{ fontSize: 15 }}
                              buttonStyle={{ borderRadius: 200 }}
                              title={ name } 
                            />
                          </View>
                        );
                      })}
                  </RadialMenu>
                </View>

                <Image
                  ref={view => { this.state.imageComponent = view; }}
                  style={[styles.centerContainer, { width: 250, height: 250 }]}
                  source={require('../img/ball.png')}
                />
              </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{ flex: 1 }}>
          <Timeline 
            style={styles.list}
            data={this.state.datas}
            circleSize={30}
            circleColor='rgba(0,0,0,0)'
            lineColor='rgb(45,156,219)'
            options={{ style:{top:-20} }}
            innerCircle={'icon'}
            onEventPress={this.onEventPress}              
            separator={false}
            detailContainerStyle={{
              paddingLeft: 5, 
              paddingRight: 5, 
              borderRadius: 0,
            }}
            iconStyle={{}}
            listViewStyle={{}}
            titleStyle={{paddingBottom: 20}}
            columnFormat='two-column'
        />
        </View>
      </ScrollView>
    );
  };
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop:20,
  },
  spreadCircle:{
    borderRadius:999,
    position:'absolute',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
