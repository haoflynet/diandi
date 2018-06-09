/**
 * 首页
 */
import React, { Component } from 'react';
import Voice from 'react-native-voice';
import { View, Text, Button, Image, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, TextInput, RefreshControl, ScrollView, Animated} from 'react-native';
import axios from 'axios';
import { API_VOICES, VOICE_TYPE_RECORD, VOICE_TYPE_ALARM, VOICE_TYPE_IMG } from '../utils/constants/config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Timeline from 'react-native-timeline-listview';
const imgSource = require('../img/record.png');
import Dimensions from 'Dimensions';


export class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => {
    let day = (new Date()).getDate();
    return {
      title: '点滴记录',
      headerLeft: (<Icon name="user" size={24} color="#007AFF" onPress={() => navigation.navigate('Profile')} style={{left: 10}} />),
      headerRight: (
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text onPress={() => navigation.navigate('Calendar')} style={{
                position: 'absolute',
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                top: 7,
                right: day > 9 ? 14 : 17,
                color: '#007AFF'
          }}>{day}</Text>
          <Icon name="calendar-o" size={24} color="#007AFF" onPress={() => navigation.navigate('Calendar')} value="10" style={{
            right: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }} 
          />
        </View>),
    }
  };

  constructor(prop) {
    super(prop);


    this.state = {
      voices: [],
      text: '',
      date: (new Date()).getDate(),
      datas: [],

      myComponent: null,

      circle: {
        ripple:3,       //同时存在的圆数量
        initialDiameter:200,    // 初始直径(最小那个圆的额直径)
        endDiameter:375,        // 最大圆的直径.TODO: 考虑是否要根据屏幕的最大宽度来改变
        initialPosition:{top:125,left:187.5}, // 这是圆的定位，动态调，这个时候并不能获取图片的地址。left是圆心，top是最上面的边，我去。。。
        rippleColor:'#5BC6AD',
        intervals:500,      //间隔时间
        spreadSpeed:2000,      //扩散速度
        component: null,

        anim: [],
        cancelAnimated: false,
        animatedFun: null,
      }
    }

    
    
    let rippleArr = [];
    for(let i=0;i<this.state.circle.ripple;i++) rippleArr.push(0);
    this.state.circle.anim = rippleArr.map(()=> new Animated.Value(0));
    


    Voice.onSpeechPartialResults = this._onSpeechPartialResults.bind(this);
    Voice.onSpeechResults = this._onSpeechResults.bind(this);
    
    // this.startAnimation();
    this.locateCircle.bind(this)
  }

  locateCircle() {
    console.log('定位');

    this.state.myComponent.measure( (fx, fy, width, height, left, top) => {
    //   let rippleArr = [];
    // for(let i=0;i<this.state.circle.ripple;i++) rippleArr.push(0);


    // this.state.circle.anim = rippleArr.map(()=> new Animated.Value(0));




      this.state.circle.initialPosition = {
        // top: top + height / 2 - (this.state.circle.endDiameter-this.state.circle.initialDiameter) / 2,
        top: 124,
        left: left + width / 2
      };
    // let rippleArr = [];
    // for(let i=0;i<this.state.circle.ripple;i++) rippleArr.push(0);
    // this.state.circle.anim = rippleArr.map(()=> new Animated.Value(0));

      
      console.log(this.state.circle.initialPosition);

      console.log('Component width is: ' + width)
      console.log('Component height is: ' + height)
      console.log('X offset to frame: ' + fx)
      console.log('Y offset to frame: ' + fy)
      console.log('X offset to page: ' + left)
      console.log('Y offset to page: ' + top)
  });  
}

  startAnimation(){
    this.state.circle.anim.map((val,index)=>val.setValue(0));
    this.state.circle.animatedFun = Animated.stagger(this.state.circle.intervals,this.state.circle.anim.map((val)=>{
      return Animated.timing(val,{toValue:1,duration:this.state.circle.spreadSpeed})
    }));
    this.state.circle.cancelAnimated = false;
    this.state.circle.animatedFun.start(()=>{if(!this.state.circle.cancelAnimated) {this.startAnimation()}});
  }

  stopAnimation(){
    this.state.circle.cancelAnimated = true;
    this.state.circle.animatedFun.stop();
    this.state.circle.anim.map((val,index)=>val.setValue(0));
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
          icon: require('../img/start.png'),
        });
      }

      this.setState({
        datas: datas,
      });
    }).catch((error) => {
      console.log('error in home.componentDidMount');
      console.log(error);
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

    this.locateCircle();
    this.startAnimation();

    this.setState({
      text: '',
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
    this.stopAnimation();
    
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

  _onPre() {
    console.log('ok');
  }

  render() {
  
    console.log(this.state);
        let r = this.state.circle.endDiameter-this.state.circle.initialDiameter;    // 直径变化量,top与left的变化是直径的一半

        // console.log('render');
        // console.log(this.state.circle.initialPosition);
        let rippleComponent = this.state.circle.anim.map((val,index)=>{
            return (
                <Animated.View key={"animatedView_"+index} style={[styles.spreadCircle,{backgroundColor:this.state.circle.rippleColor},{
                    opacity:val.interpolate({
                                inputRange:[0,1],
                                outputRange:[1,0]
                            }),
                    height:val.interpolate({
                                inputRange:[0,1],
                                outputRange:[this.state.circle.initialDiameter,this.state.circle.endDiameter]
                            }),
                    width:val.interpolate({
                                inputRange:[0,1],
                                outputRange:[this.state.circle.initialDiameter,this.state.circle.endDiameter]
                            }),
                    top:val.interpolate({
                                inputRange:[0,1],
                                outputRange:[this.state.circle.initialPosition.top - this.state.circle.initialDiameter/2,this.state.circle.initialPosition.top - this.state.circle.initialDiameter/2 - r/2]
                            }),
                    left:val.interpolate({
                                inputRange:[0,1],
                                outputRange:[this.state.circle.initialPosition.left - this.state.circle.initialDiameter/2,this.state.circle.initialPosition.left - this.state.circle.initialDiameter/2 - r/2]
                            }),
                    }]}></Animated.View>
            )
        });

    return (
            
      <ScrollView style={{flex:1}}>



        <View style={{
          flex: 1,
          flexDirection:'row',
        }}>
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



                        <View>
                {rippleComponent}
            </View>

        <View style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}>
            <TouchableWithoutFeedback 
          onPressIn={this._startRecognizing.bind(this)} onPressOut={this._stopRecognizing.bind(this)}
            style={{
                          // position: 'absolute',
                          // zIndex: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
            }} >
              <View style={{
                                          justifyContent: 'center',
                                          alignItems: 'center',
              }}>
                  <Icon name="microphone" size={70} color="black"
                  style={{
                    color: "#99A7F2",
                    position: 'absolute',
                    zIndex: 1,
                }} />

                <Image
                ref={view => { this.state.myComponent = view; }}

                style={{
                  width: 250, 
                  height: 250,
                  alignItems: 'center',
                  justifyContent:'center',
                }}
                source={require('../img/ball.png')}
              />

              </View>
            </TouchableWithoutFeedback>
                      </View>


        <View style={{
          flex: 1
        }}>
          <Timeline 
            style={styles.list}
            data={this.state.datas}
            circleSize={30}
            circleColor='rgba(0,0,0,0)'
            lineColor='rgb(45,156,219)'

            // timeContainerStyle={{minWidth:52, marginTop: -5}}
            // timeStyle={{textAlign: 'center', color:'white', padding:5, borderRadius:13}}
            // descriptionStyle={{color:'gray'}}

            options={{
              style:{top:-20}
            }}

            innerCircle={'icon'}
            onEventPress={this.onEventPress}              
            separator={false}

            detailContainerStyle={{
              // marginBottom: 0, 
              paddingLeft: 5, 
              paddingRight: 5, 
              // backgroundColor: "red", 
              borderRadius: 0,
              // paddingTop: 20,
              // paddingBottom: 20
            }}
            iconStyle={{
              // paddingTop: 20,
              // paddingBottom: 20
            }}
            listViewStyle={{
              // paddingTop: 20
            }}
            titleStyle={{
              // marginTop: -10,
              paddingBottom: 20
            }}
            columnFormat='two-column'
        />
        </View>

   
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
  },
  spreadCircle:{
    borderRadius:999,
    position:'absolute',
},
});
