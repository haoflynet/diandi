/**
 * 个人中心
 */

import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Switch } from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';


export class ProfileScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '个人中心',
    headerLeft: (<Icon name="chevron-left" size={30} color="#007AFF" onPress={() => navigation.navigate('Home')} style={{marginLeft: 10}} />),
  });

  render() { 
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.userRow}>
          <View style={styles.userImage}>
            <Avatar
              rounded
              size="large"
              source={{
                uri: 'https://avatars3.githubusercontent.com/u/6014844?s=400&u=0de98c0f210e56252793dfd813a632df8510b7d0&v=4',
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 16 }}>豪翔天下</Text>
            <Text style={{ fontSize: 16, color: 'gray' }}>haoflynet@gmail.com</Text>
          </View>
        </View>

      

        <View>
          <ListItem
              chevron
              title="提醒列表"
              containerStyle={styles.listItemContainer}
              leftIcon={
                <View style={{
                  alignItems: 'center',
                  backgroundColor: 'black',
                  borderColor: 'transparent',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 34,
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginRight: 18,
                  width: 34,
                  backgroundColor: '#FFADF2',
                }}>
                  <Icon
                    size={24}
                    color="white"
                    type="font-awesome"
                    name="list"
                    icon={{
                      type: 'font-awesome',
                      name: 'list',
                    }}                
                  />
                </View>
              }
            />
          <ListItem
              chevron
              title="记录列表"
              containerStyle={styles.listItemContainer}
              onPress={() => this.onPressOptions()}
              leftIcon={
                <View style={{
                  alignItems: 'center',
                  backgroundColor: 'black',
                  borderColor: 'transparent',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 34,
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginRight: 18,
                  width: 34,
                  backgroundColor: '#FFADF2',
                }}>
                  <Icon
                    size={24}
                    color="white"
                    type="font-awesome"
                    name="th-list"
                    icon={{
                      type: 'font-awesome',
                      name: 'th-list',
                    }}                
                  />
                </View>
              }
            />
          <ListItem />
          <ListItem
              hideChevron
              title="清除缓存"
              containerStyle={styles.listItemContainer}
              leftIcon={
                <View style={{
                  alignItems: 'center',
                  backgroundColor: 'black',
                  borderColor: 'transparent',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 34,
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginRight: 18,
                  width: 34,
                  backgroundColor: '#FFADF2',
                }}>
                  <Icon
                    size={24}
                    color="white"
                    type="material-community"
                    name="delete-forever"
                    icon={{
                      type: 'material-community',
                      name: 'delete-forever',
                    }}                
                  />
                </View>
              }
            />
          <ListItem
              chevron
              title="帮助与反馈"
              containerStyle={styles.listItemContainer}
              leftIcon={
                <View style={{
                  alignItems: 'center',
                  backgroundColor: 'black',
                  borderColor: 'transparent',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 34,
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginRight: 18,
                  width: 34,
                  backgroundColor: '#FFADF2',
                }}>
                  <Icon
                    size={24}
                    color="white"
                    type="material-community"
                    name="delete-forever"
                    icon={{
                      type: 'material-community',
                      name: 'delete-forever',
                    }}                
                  />
                </View>
              }
            />
          <ListItem
              chevron
              title="关于"
              containerStyle={styles.listItemContainer}
              leftIcon={
                <View style={{
                  alignItems: 'center',
                  backgroundColor: 'black',
                  borderColor: 'transparent',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 34,
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginRight: 18,
                  width: 34,
                  backgroundColor: '#FFADF2',
                }}>
                  <Icon
                    size={24}
                    color="white"
                    type="octicon"
                    name="versions"
                    icon={{
                      type: 'octicon',
                      name: 'versions',
                    }}                
                  />
                </View>
              }
            />
          <ListItem
              hideChevron
              title="退出登录"
              containerStyle={styles.listItemContainer}
              leftIcon={
                <View style={{
                  alignItems: 'center',
                  backgroundColor: 'black',
                  borderColor: 'transparent',
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 34,
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginRight: 18,
                  width: 34,
                  backgroundColor: '#FFADF2',
                }}>
                  <Icon
                    size={24}
                    color="white"
                    type="ionicon"
                    name="md-exit"
                    icon={{
                      type: 'ionicon',
                      name: 'md-exit',
                    }}                
                  />
                </View>
              }
            />
          <ListItem />
        </View>

        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
})