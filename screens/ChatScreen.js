import React from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Animated,
    SafeAreaView, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Dimensions} from 'react-native';
import firebase from 'firebase'

const isIOS = Platform.OS === 'ios';
const isAND = Platform.OS === 'android';

import styles from '../constants/styles'
import User from '../User';
import { FlatList } from 'react-native-gesture-handler';

export default class ChatScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('name', null)
        }
    }

    constructor(props){
        super(props);
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone'),
            },
            textMessage: '',
            messageList:[],
            dbRef: firebase.database().ref('messages'),

            a: 0
        }
        this.keyboardHeight = new Animated.Value(0);
        this.bottomPadding = new Animated.Value(60);
    }

    componentDidMount(){
        this.keyboardShowListener = Keyboard.addListener(isIOS ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => this.keyboardEvent(e, true));
        this.keyboardHideListener = Keyboard.addListener(isIOS ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => this.keyboardEvent(e, false));    
        this.state.dbRef.child(User.phone).child(this.state.person.phone)
        .on('child_added', (value)=>{
            this.setState((prevState)=>{
                return {
                    messageList: [...prevState.messageList, value.val()]
                }
            })
        })
    }

    componentWillUnmount(){
        this.state.dbRef.off();
        this.keyboardShowListener.remove();
        this.keyboardHideListener.remove();
    }    

    keyboardEvent = (event, isShow) => {
        let heightOS = 100;
        let bottomOS = 120;
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: isShow ? heightOS : 0
            }),
            Animated.timing(this.bottomPadding, {
                duration: event.duration,
                toValue: isShow ? bottomOS : 100
            })
        ]).start();

        if(isShow == true) {
            this.setState({a: 120});
        } else if(isShow == false) {
            this.setState({a: 0});
        }
        
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    convertTime = (time) => {
        let d = new Date(time);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        if(c.getDay() !== d.getDay()){
            result = d.getDay() + '' + d.getMonth() + '' + result;
        }
        return result;
    }


    sendMessage = async () => {
        if(this.state.textMessage.length > 0){
            let msgId = this.state.dbRef.child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates[User.phone + '/' + this.state.person.phone + '/'  + msgId] = message;
            updates[this.state.person.phone + '/' + User.phone + '/'  + msgId] = message;
            this.state.dbRef.update(updates);
            this.setState({ textMessage: '' })

        }
    }

    renderRow = ({item}) => {
        return(
            <View style={{
                flexDirection: 'row',
                maxWidth: '60%',
                alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.phone ? '#007aff' : '#525252',
                borderRadius:15,
                marginBottom:10
            }}>
                <Text style={{color:'#fff', padding:7, fontSize:16}}>
                    {item.message}
                </Text>
                <Text style={{color:'#eee', padding:3, fontSize:12}}>{this.convertTime(item.time)}</Text>
            </View>
        )
    }

    render(){
        let {height} = Dimensions.get('window');
        return(
            <KeyboardAvoidingView behavior="height" style={{flex: 1}}>       
                <View style={{flex: 9, bottom: this.state.a}}>
                <FlatList 
                    ref={ref => this.flatList = ref}
                    onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
                    onLayout={() => this.flatList.scrollToEnd({animated: true})}
                    style={{paddingTop:5, paddingHorizontal:5, height}}
                    data= {this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    // ListFooterComponent={<Animated.View style={{height:this.bottomPadding}} />}
                />
                </View>
                <View style={{flex: 1}}>
                <Animated.View style={[styles.bottomBar, {bottom: this.keyboardHeight}]}>
                    <TextInput
                        style={styles.inputMessage}
                        value={this.state.textMessage}
                        placeholder="Type message..."
                        onChangeText={this.handleChange('textMessage')}
                    />
                    <TouchableOpacity onPress={this.sendMessage} style={{marginBottom:10, marginLeft:0}}>
                        <Image source={require('../images/send.png')} style={{resizeMode:'contain', height:30}} />
                    </TouchableOpacity>
                </Animated.View>        
                </View>

            </KeyboardAvoidingView>
        )
    }
}