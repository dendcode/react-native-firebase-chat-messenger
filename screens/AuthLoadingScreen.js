import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import firebase from 'firebase';
import User from '../User';

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }


    componentWillMount() {

            var firebaseConfig = {
                apiKey: "AIzaSyAs2l05lBdIJFKQu4fDVO2y3thUzCzKbT8",
                authDomain: "chat-01-8118d.firebaseapp.com",
                databaseURL: "https://chat-01-8118d.firebaseio.com",
                projectId: "chat-01-8118d",
                storageBucket: "chat-01-8118d.appspot.com",
                messagingSenderId: "256043880178",
              };
              // Initialize Firebase
            //   if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            //   }
            //   firebase.analytics();        

    }



    _bootstrapAsync = async () => {
        User.phone = await AsyncStorage.getItem('userPhone');
        this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }

}