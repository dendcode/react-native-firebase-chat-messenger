import React from 'react';
import {View, Text, Image, SafeAreaView, TextInput, ActivityIndicator, TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import User from '../User';
import styles from '../constants/styles';
import {} from 'react-native-gesture-handler';
import firebase from 'firebase';


export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: 'Profile'
    }

    state = {
        name: User.name,
        imageSource: User.image ? {uri : User.image} : require('../images/user.png'),
        image:null,
        upload: false
    }

    handleChange = key => val => {
        this.setState({[key]:val})
    }

    _logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    changeName = async () => {
        if (this.state.name.length < 3) {
            Alert.alert('에러', '사용자명이 너무 짧습니다');
        } else if (User.name !== this.state.name) {
            User.name = this.state.name;
            this.updateUser();
        }
    }

    // changeImage = () => {
    //     const options = {
    //         qulity: 0.7, allowsEditing:true, mediaType:'photo', noData:true,
    //         storageOptions:{
    //             skipBackup: true, waitUntilSaved: true, path: 'images', cameraRoll:true
    //         }
    //     }
    //     ImagePicker.showImagePicker(options, response => {
    //         if(response.error){
    //             console.log(error)
    //         }else if(!response.didCancel){
    //             this.setState({
    //                 imageSource: {uri: response.uri}
    //             })
    //         }

    //     })
    // }


    componentDidMount(){
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _pickImage = async () => {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                storageOptions:{
                    skipBackup: true, waitUntilSaved: true, path: 'images', cameraRoll:true
                }
            });
            if (!result.cancelled) {
                this.setState({ 
                    imageSource: {uri: result.uri},
                    upload: true
                }, this.uploadFile)
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    }


    updateUser = () => {
        firebase.database().ref('users').child(User.phone).set(User);
        Alert.alert('완료', '저장되었습니다');
    }


    updateUserImage = (imageUrl) => {
        User.image = imageUrl;
        firebase.database().ref('users').child(User.phone).set({ image: imageUrl });
        Alert.alert('완료', '이미지가 변경되었습니다.')        
        this.setState({ upload: false, imageSource: { uri: imageUrl} })
    }

    uploadFile = async () => {
        const file = await this.uriToBlob(this.state.imageSource.uri);
        firebase.storage().ref().child(`profile_pictures/${User.phone}.png`)
            .put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => this.updateUserImage(url))
            .catch(error => {
                this.setState({
                    upload: false,
                    imageSource: require('../images/user.png')
                });
                Alert.alert('띠용?', '업로드 이미지 에러');
        })
    }

    uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function(){
                reject(new Error('Error on upload image'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
    }


    render(){
        return(
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={this._pickImage}>
                    {
                        this.state.upload ? <ActivityIndicator size="large"/> :
                        <Image style={{borderRadius: 100, width:150, height:150, resizeMode:'cover', marginBottom:10}} source={this.state.imageSource} />
                    }
                </TouchableOpacity>
                <Text style={{fontSize:20}}>
                    {User.phone}
                </Text>
                <Text style={{fontSize:20}}>
                    Nickname:
                </Text>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                />
                <TouchableOpacity onPress={this.changeName}>
                    <Text style={styles.btnText}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._logOut}>
                    <Text style={styles.btnText}>LogOut</Text>
                </TouchableOpacity>                
            </SafeAreaView>
        )
    }
}