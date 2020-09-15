import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingScreen from '@/pages/Setting';
import Password from '@/pages/Setting/password';


const Stack = createStackNavigator();

export default function SettingStack() {
    return (
        <Stack.Navigator 
          initialRouteName='main' 
        >
          <Stack.Screen name='main' initialParams={{ title: "會員設定" }} component={SettingScreen} />
          <Stack.Screen name='password' initialParams={{ title: "更改密碼" }}  component={Password} />
        </Stack.Navigator>
    );
  }