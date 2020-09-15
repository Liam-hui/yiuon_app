import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, TouchableHighlight, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import { Services } from '@/services/';

export default function LoginScreen({navigation}) {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fail, setFail] = useState(0);
  
  const handleLogin = (number,password,setFail) => {
    if(number!=''&&password!='') Services.logIn(number,password,setFail);
  }

  React.useCallback(() => {

    return () => {};
  }, [])

  return (
    <SafeAreaView>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-1.png')}
      > 
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titleText}>
          基督教聖約教會{"\n"}
          耀安長者鄰舍中心
        </Text>
        <Image
          style={{height:90}}
          resizeMode='contain'
          source={require('@/img/logo.png')}
        />
        <View style={styles.loginWrapper}>
          <Title style={styles.inputText}>登入編號</Title>
          <FormInput
            autoCapitalize='none'
            onChangeText={userNumber => {setNumber(userNumber);setFail(0);}}
          />
          <Title style={styles.inputText}>密碼</Title>
          <FormInput
            secureTextEntry={true}
            onChangeText={userPassword => {setPassword(userPassword);setFail(0);}}
          />
          <Text style={{marginTop:10, opacity:fail}}>登入失敗！</Text>
          <FormButton
            title='登入'
            addStyle={{marginTop:10}}
            labelStyle={{fontSize: 20}}
            onPress={() => {
              handleLogin(number,password,setFail);
            }}
          />
        </View>
        <TouchableOpacity onPress={() => {navigation.push('ForgetPassword')}}>
            <Text style={{marginVertical:20,fontSize:16,fontWeight:'500',color:'#a04b97'}}>忘記密碼</Text>
        </TouchableOpacity>
          <View style={styles.bottomButtonWrapper}>
            <TouchableHighlight 
              style={[styles.bottomButton,{left:0}]}
              onPress={() => {navigation.push('Contact')}}
            >
              <Image
                style={{height:'100%', width:'100%'}}
                source={require('@/img/Btn_contact.png')}
              />
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.bottomButton,{right:0}]}
              onPress={() => {navigation.push('News')}}
            >
              <Image
                style={{height:'100%', width:'100%'}}
                source={require('@/img/Btn_news.png')}
              />
            </TouchableHighlight>
          </View>

      </ScrollView>

    </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 40,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 18
  },
  loginWrapper:{
    marginTop:30,
    width: '80%',
  },
  inputText: {
    color: '#A24982',
    fontSize: 20,
    marginBottom: 2
  },
  bottomButtonWrapper: {
    // backgroundColor: 'red',
    // marginTop: 10,
    marginTop:'auto',
    width: '90%',
    height: 110,
  },
  bottomButton: {
    height: '100%', 
    width: '47%',
    position: 'absolute',
    top: 0
    // right: 0
  }

});