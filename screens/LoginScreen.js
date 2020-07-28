import React, {Component} from 'react';
import {Text, TextInput, View, TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import firebase from 'firebase';

import User from '../User';
import styles from '../constants/styles';

export default class LoginScreen extends Component{
    static navigationOptions = {
        header: null
    }

    state = {
        phone: '',
        name: ''
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }



    submitForm = async () => {

        // var firebaseConfig = {
        //     apiKey: "AIzaSyAs2l05lBdIJFKQu4fDVO2y3thUzCzKbT8",
        //     authDomain: "chat-01-8118d.firebaseapp.com",
        //     databaseURL: "https://chat-01-8118d.firebaseio.com",
        //     projectId: "chat-01-8118d",
        //     storageBucket: "chat-01-8118d.appspot.com",
        //     messagingSenderId: "256043880178",
        //     appId: "1:256043880178:web:d91835859741c395c74a6b",
        //     measurementId: "G-TY7DY9YLZ1"
        //   };
        // //   Initialize Firebase
        //   if (!firebase.apps.length) {
        //     firebase.initializeApp(firebaseConfig);
        //   }

        if(this.state.phone.length < 10){
            Alert.alert('Error','Wrong Phone Number')
        }else if(this.state.name.length < 3){
            Alert.alert('Error', 'Wrong Name')
        }else{
        // 유저 데이터 저장
            await AsyncStorage.setItem('userPhone', this.state.phone);
            User.phone = this.state.phone;
            firebase.database().ref('users/' + User.phone).set({name: this.state.name});
            firebase.database().
            this.props.navigation.navigate('App');
        }
        // alert(this.state.phone + '\n' + this.state.name)
    }

    render() {
        return (
        <View style={styles.container}>
            <TextInput
            placeholder="Phone Number"
            style={styles.input}
            value={this.state.phone}
            onChangeText={this.handleChange('phone')}
            />
            <TextInput
            placeholder="Name"
            style={styles.input}
            value={this.state.name}
            onChangeText={this.handleChange('name')}          
            />
            <TouchableOpacity onPress={this.submitForm}>
            <Text style={styles.btnText}>Enter</Text>
            </TouchableOpacity>
        </View>
        )
    }
}
