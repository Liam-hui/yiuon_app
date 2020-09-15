import React from 'react';
import { createStackNavigator} from '@react-navigation/stack';
import { DrawerNavigator} from '@/navigation/Drawer';
import { Header } from '@/components/Header';

const Stack = createStackNavigator();

export default function MainStack() {

    return (
        <Stack.Navigator
          initialRouteName="Main"
          headerMode="screen"
          screenOptions={{
            header: ({ scene, navigation}) => (
              <Header scene={scene}  navigation={navigation}/>
            ),
          }}
        >
        <Stack.Screen
          name="Main"
          component={DrawerNavigator}
          options={({ route }) => {
            let myParams = [];
            let back = false;
            let headerShown = false;
            if(route.state) {
              const part = route.state.routes[route.state.index];
              myParams = part.params;
              if(part.state){
                myParams = part.state.routes[part.state.index].params;
                if(part.state.index>0){
                  back = true;
                }
              }
            }
            if(!myParams.title) myParams.title = '';
              else headerShown = true;
            return { headerShown:headerShown, headerTitle: myParams.title, color_mode:myParams.color_mode, right:myParams.right, back:back, pop:myParams.pop};
          }}
        />
        </Stack.Navigator>
    );
  };