import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AlbumScreen from '@/pages/Album';
import AlbumDetailScreen from '@/pages/Album/detail';
import AddPhotoScreen from '@/pages/Album/AddPhoto';

const Stack = createStackNavigator();

export default function AlbumStack() {
    return (
        <Stack.Navigator 
          initialRouteName='main' 
        >
          <Stack.Screen name='main' initialParams={{ title: "活動相簿" }}  component={AlbumScreen} />
          <Stack.Screen name='detail' component={AlbumDetailScreen} />
          <Stack.Screen name='add-photo' initialParams={{ title: "提交照片" }}  component={AddPhotoScreen} />
        </Stack.Navigator>
    );
  }