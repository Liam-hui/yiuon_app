import React, { useState, useEffect } from 'react';
import { View,TouchableOpacity, Image, Button, Text, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Appbar, Avatar, useTheme, DefaultTheme, IconButton } from 'react-native-paper';
import { DrawerActions,useRoute } from '@react-navigation/native';
import{useSelector,useDispatch} from 'react-redux';
import PopOutOptionFull from '@/components/PopOutOptionFull';
import store from '@/store';
import actions from '@/store/ducks/actions';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#984582',
    icon: '#984582',
    bg: '#ebf5fc',
  },
  colors_1: {
    ...DefaultTheme.colors,
    text: '#6a6a6a',
    icon: '#6a6a6a',
    bg: '#ebf5fc',
  },
  colors_2: {
    ...DefaultTheme.colors,
    text: '#FFFFFF',
    icon: '#FFFFFF',
    bg: '#a07a9e',
  },
  colors_3: {
    ...DefaultTheme.colors,
    text: '#984582',
    icon: '#984582',
    bg: '#f2f2f4',
  },
};


export const Header = ({ scene, navigation}) => {

  // console.log(scene.descriptor.options);
    const title = scene.descriptor.options.headerTitle;
    const color_mode = scene.descriptor.options.color_mode;
    const right = scene.descriptor.options.right;
    const back = scene.descriptor.options.back;
    let pop = scene.descriptor.options.pop;
    if(!pop) pop = navigation.popToTop;

    let color_chosen = theme.colors;

    switch(color_mode) {
      case 1:
        color_chosen = theme.colors_1;
        break;
      case 2:
        color_chosen = theme.colors_2;
        break;
      case 3:
        color_chosen = theme.colors_3;
        break;
    }
    
    const drawer_on = useSelector(state => state.drawer_on);
    const invalidToken = useSelector(state => state.invalidToken);

    const RenderRight = () => {
      if(right)
         return right();
      return null;
    }
    
    return (
      <Appbar.Header
        // statusBarHeight={50}
        theme={{ colors: { primary: color_chosen.bg } }}
        style={{paddingHorizontal:5}}
      >
        {back ? (
          <Appbar.BackAction
            onPress={pop}
            color={color_chosen.icon}
            size={20}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              if(drawer_on) navigation.dispatch(DrawerActions.closeDrawer());
                else navigation.dispatch(DrawerActions.openDrawer());
            }}
          >
          <IconButton
            icon={({ size}) => (
              <Image
                source={require('@/img/Btn_menu.png')}
                style={{ width: size, height: size}}
              />
            )}
            size={20}
          />
          </TouchableOpacity>
        )}
        <Appbar.Content
          title={
              title
          }
          titleStyle={{
            fontSize: 18,
            fontWeight: 'bold',
            color: color_chosen.text,
            textAlign: 'center',
          }}
        />

        <View style={{width:50}}>{RenderRight()}</View>

        {invalidToken? (
          <PopOutOptionFull
          text={'你已於其他位置登入，請重新登入。'}
          butTextTop={'確定'}
          butFuncTop={()=>{store.dispatch(actions.logoutAction());}}
          />
          // <Text>sadf</Text>
          ):(null)
        }

      </Appbar.Header>
    );
  }