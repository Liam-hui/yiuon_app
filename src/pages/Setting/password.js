import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text} from 'react-native';
import { Title } from 'react-native-paper';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import{useSelector,useDispatch} from 'react-redux';
import { Services } from '@/services/';

export default function Password() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [warning, setWarning] = useState('');

  const member_number = useSelector(state => state.auth_state.userData.member_number);

  const handleSubmit = () => {
    if(oldPassword=='')setWarning('請輸入舊密碼');
      else if (newPassword=='')setWarning('請輸入新密碼');
        else if (confirmPassword=='')setWarning('請再次輸入新密碼');
    if(newPassword==confirmPassword) Services.change_password(member_number,oldPassword,newPassword,confirmPassword,setWarning) ;
  }

  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      resizeMode='cover' 
      source={require('@/img/background-3.png')}
    > 
      <View style={styles.container}>
        <View style={styles.loginWrapper}>
          <Title style={styles.inputText}>登入編號</Title>
          <Text style={{fontSize:20,marginBottom: 16}}>{member_number}</Text>
          <Title style={styles.inputText}>輸入舊密碼</Title>
          <FormInput
            // labelName='Password'
            // value={oldPassword}
            secureTextEntry={true}
            onChangeText={userPassword => {setWarning(''),setOldPassword(userPassword)}}
          />
          <Title style={styles.inputText}>輸入新密碼</Title>
          <FormInput
            // labelName='Password'
            // value={newPassword}
            secureTextEntry={true}
            onChangeText={userPassword => {setWarning(''),setNewPassword(userPassword)}}
          />
          <Title style={styles.inputText}>再次輸入新密碼</Title>
          <FormInput
            // labelName='Password'
            // value={confirmPassword}
            secureTextEntry={true}
            onChangeText={userPassword => {setWarning(''),setConfirmPassword(userPassword)}}
          />

          <Text style={styles.warn}>
            {warning!=''?
              (warning)
              :(' ')
            }
            {warning=='' && newPassword!='' && confirmPassword!='' && newPassword!=confirmPassword ?
              ('兩次密碼輸入不一致，請重新輸入')
              :(' ')
            }
          </Text>
          
          <FormButton
            title='提交'
            addStyle={{marginTop:30}}
            labelStyle={{fontSize: 20}}
            onPress={() => {handleSubmit()}}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 18
  },
  loginWrapper:{
    width: '80%',
  },
  inputText: {
    color: '#A24982',
    fontSize: 20,
    marginBottom: 2
  },
  bottomButtonWrapper: {
    // backgroundColor: 'red',
    marginTop: 10,
    width: '90%',
    height: 110
  },
  bottomButton: {
    height: '100%', 
    width: '47%',
    position: 'absolute',
    top: 0
    // right: 0
  }

});