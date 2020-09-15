import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '@/pages/Chat';
import Chatroom from '@/pages/Chat/chatroom';
import ChatSettingScreen from '@/pages/Chat/chat-setting';
import SearchUserListScreen from '@/pages/Chat/search_user_list';
import AddNewGroupScreen from '@/pages/Chat/add-group';


const Stack = createStackNavigator();

export default function ChatStack() {
    return (
        <Stack.Navigator 
          initialRouteName='main' 
        >
          <Stack.Screen name='main' initialParams={{ title: "留言聊天" }} component={ChatScreen} />
          <Stack.Screen name='chatroom' initialParams={{ title: "活" }} component={Chatroom} />
          <Stack.Screen name='search_user_list' initialParams={{ title: "留言聊天" }} component={SearchUserListScreen} />

          {/* admin */}
          <Stack.Screen name='chat-setting' component={ChatSettingScreen} />
          <Stack.Screen name='add-group'initialParams={{ title: "新增群組" }} component={AddNewGroupScreen} />
        </Stack.Navigator>
    );
  }