import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/pages/Login';
import ForgetPasswordScreen from '@/pages/ForgetPassword';
import NewsScreen from '@/pages/News';
import ContactScreen from '@/pages/Contact';
import { Header } from '@/components/Header';
import{ useSelector} from 'react-redux';
import MainStack from '@/navigation/MainStack';

const Stack = createStackNavigator();

export default function AuthStack() {
  const loggedIn = useSelector(state => state.auth_state.loggedIn);

    return (
        <Stack.Navigator 
          initialRouteName='Login' 
          screenOptions={{
            header: ({ scene, previous, navigation }) => (
              <Header scene={scene} previous={previous} navigation={navigation} />
            ),
          }}
        >
          {loggedIn ? (
            <>
              <Stack.Screen name="Main" component={MainStack} />
            </>
          ) : (
            <>
              <Stack.Screen name='Login' options={{headerShown: false}} component={LoginScreen} />
              <Stack.Screen name='ForgetPassword' options={{headerTitle:"忘記密碼", back:true}} component={ForgetPasswordScreen} />
              <Stack.Screen name="News" options={{headerTitle:"中心消息", back:true}} component={NewsScreen} />
              <Stack.Screen name="Contact" options={{headerTitle:"聯絡我們", back:true}} component={ContactScreen} />
            </>
          )}
        </Stack.Navigator>
    );
  }