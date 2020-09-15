import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsScreen from '@/pages/News';
import NewsDetail from '@/pages/News/detail';


const Stack = createStackNavigator();

export default function NewsStack() {
    return (
        <Stack.Navigator 
          initialRouteName='main' 
        >
          <Stack.Screen name='main' initialParams={{ title: "中心消息" }} component={NewsScreen} />
          <Stack.Screen name='detail' initialParams={{ title: "中心消息" }} component={NewsDetail} />
        </Stack.Navigator>
    );
  }