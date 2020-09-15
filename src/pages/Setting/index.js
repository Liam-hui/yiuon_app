import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-paper';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image,SafeAreaView,ScrollView} from 'react-native';
import FormButton from '@/components/FormButton';
import {PickImage} from '@/components/PickImage';
import { Services } from '@/services/';

function SettingScreen({navigation}) {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    Services.get('user/profile',(data)=>setUserData(data));
  }, []);

  const change_pic = (uri) => {
    Services.change_pic(uri,()=>Services.get('user/profile',(data)=>setUserData(data)) );
  }

  return (
    <SafeAreaView>
      <ImageBackground
          style={{width: '100%', height: '100%'}}
          resizeMode='cover' 
          source={require('@/img/background-5.png')}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.upper}>
            <Text style={{fontSize:19, marginBottom:8}}>{userData.name}</Text>
            <Text style={{fontSize:17, marginBottom:30}}>會員編號：{userData.member_number}</Text>
            <Avatar.Image size={160} style={{backgroundColor:'rgba(0,0,0,0)'}} source={{ uri: userData.pic }}/>
          </View>

          <View style={styles.wrapper}>
            <FormButton
              title='更改頭像'
              addStyle={{marginTop:60}}
              labelStyle={{fontSize: 20}}
              onPress = {() => {
                PickImage(change_pic);
              }}
            />
            <FormButton
              onPress={() => navigation.navigate('password')}
              //  onPress={() => Services.get('user/profile',(data)=>setUserData(data))}
              title='更改密碼'
              addStyle={{marginTop:18}}
              labelStyle={{fontSize: 20}}
            />
          </View>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  upper:{
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height:'60%',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.6)'
  },
  wrapper:{
    width: '80%',
  },
});