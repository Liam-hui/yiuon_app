import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InfoScreen from '@/pages/Info';
import InfoDetail from '@/pages/Info/detail';
import { useIsDrawerOpen } from '@react-navigation/drawer';

const Stack = createStackNavigator();

export default function InfoStack() {
  const aa = useIsDrawerOpen();
  console.log(aa);
    return (
        <Stack.Navigator 
          initialRouteName='main' 
          // headerMode="screen"
          // screenOptions={{
          //   headerShown: true,
          //   header: ({ scene, previous, navigation, AddRight}) => (
          //     <Header scene={scene} previous={previous} navigation={navigation}/>
          //   ),
          // }}
        >
          <Stack.Screen name='main' initialParams={{ title: "活動資訊" }} component={InfoScreen} />
          <Stack.Screen name='detail' initialParams={{ title: "活動資訊" }} component={InfoDetail} />
        </Stack.Navigator>
    );
  }