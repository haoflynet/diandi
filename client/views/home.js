/**
 * 首页
 */
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';


export class HomeScreen extends Component {
  /**
   * 录音按钮
   */
  _recordSound () {
    console.log('_recordSound');
  }
  /**
   * 查询记录
   */
  _searchRecord () {
    console.log('_searchRecord');
  }
  /**
   * 日常记录
   */
  _record () {
    console.log('_record');
  }
  /**
   * 普通提醒
   */
  _remind () {
    console.log('_remind');
  }
  /**
   * 模糊提醒
   */
  _fuzzyRemind () {
    console.log('_fuzzyRemind');
  }

  render() {
      return (
        <View>
          <Text>HomeScreen</Text>
          <Button
            onPress={ () => this._recordSound() }
            title="录音按钮"
          />
          <Button
            onPress={ () => this._searchRecord() }
            title="查询记录"
          />
          <Button
            onPress={ () => this._record() }
            title="日常记录"
          />
          <Button
            onPress={ () => this._remind() }
            title="普通提醒"
          />
          <Button
            onPress={ () => this._fuzzyRemind() }
            title="模糊提醒"
          />
        </View>
      )
    }
}