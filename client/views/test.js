import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    TouchableHighlight,
    Image,
} from 'react-native';

import Dimensions from 'Dimensions';

export class TestScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            ripple:2,       //同时存在的圆数量
            initialDiameter:250,    // 初始直径(最小那个圆的额直径)
            endDiameter:370,        // 最大圆的直径.TODO: 考虑是否要根据屏幕的最大宽度来改变
            initialPosition:{top:125,left:180}, // 这是圆的定位，动态调整
            rippleColor:'#5BC6AD',
            intervals:500,      //间隔时间
            spreadSpeed:2000,      //扩散速度
            component: null,
        }

        let rippleArr = [];
        for(let i=0;i<this.state.ripple;i++) rippleArr.push(0);
        this.state.anim = rippleArr.map(()=> new Animated.Value(0))
        
        this.cancelAnimated = false;
        this.animatedFun = null;
        this.startAnimation();

        // this.mea.bind(this)
    }
    componentDidMount() {
        // Print component dimensions to console
        // setTimeout(this.mea.bind(this), 1000);

    }

    mea() {
        console.log('====');
        console.log(this.state);

        this.state.myComponent.measure( (fx, fy, width, height, px, py) => {
            console.log('Component width is: ' + width)
            console.log('Component height is: ' + height)
            console.log('X offset to frame: ' + fx)
            console.log('Y offset to frame: ' + fy)
            console.log('X offset to page: ' + px)
            console.log('Y offset to page: ' + py)
        });

        console.log(Dimensions.get('window'));
    }
    startAnimation(){
        // 首先获取图片的上下左右直径
        console.log('once');

        this.state.anim.map((val,index)=>val.setValue(0));
        this.animatedFun = Animated.stagger(this.state.intervals,this.state.anim.map((val)=>{
            return Animated.timing(val,{toValue:1,duration:this.state.spreadSpeed})
        }));
        this.cancelAnimated = false;
        this.animatedFun.start(()=>{if(!this.cancelAnimated) {this.startAnimation()}});
    }
    stopAnimation(){
        this.cancelAnimated = true;
        this.animatedFun.stop();
        this.state.anim.map((val,index)=>val.setValue(0));
    }
    render(){
        
        console.log(this.state);
        let r = this.state.endDiameter-this.state.initialDiameter;    // 直径变化量,top与left的变化是直径的一半
        let rippleComponent = this.state.anim.map((val,index)=>{
            return (
                <Animated.View key={"animatedView_"+index} style={[styles.spreadCircle,{backgroundColor:this.state.rippleColor},{
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
                    }]}></Animated.View>
            )
        })
        return (
            <View>
                            <View>
                {rippleComponent}
            </View>
            <View 
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
              <TouchableHighlight onPressIn={this.startAnimation}>
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
              </TouchableHighlight>
            </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    spreadCircle:{
        borderRadius:999,
        position:'absolute',
    },
})