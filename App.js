import React from 'react';
// import {StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import {Image} from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';

const AppStack = createStackNavigator({ 
  Home: HomeScreen, 
  Chat: ChatScreen  
});

AppStack.navigationOptions = ({navigation}) => {
  let tabBarVisible = navigation.state.index === 0;
  return {
    tabBarVisible
  };
};


const AuthStack = createStackNavigator({ Login: LoginScreen });

const TabNavigator = createBottomTabNavigator({
  Chats: AppStack,
  Profile: ProfileScreen
},{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal}) => {
      const { routeName } = navigation.state;
      let imageName = require('./images/chats.png');
      if (routeName === 'Profile') {
        imageName = require('./images/settings.png');
      }
      return <Image source={imageName} style={{width:25, resizeMode: 'contain'}} />;
    },
  }),
  tabBarOptions: {
    activeTintcolor: 'tomato',
    inactiveTintcolor: 'gray',
  },
})

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: TabNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));