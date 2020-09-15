import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image,Text,TouchableOpacity} from 'react-native';
import { Drawer } from 'react-native-paper';
import { DrawerItem,DrawerContentScrollView,useIsDrawerOpen } from '@react-navigation/drawer';
import{ useSelector,useDispatch } from 'react-redux';
import actions from '@/store/ducks/actions';
import PopOutOption from '@/components/PopOutOption';
import { Services } from '@/services/';

export function DrawerContent(props) {
  const isDrawerOpen = useIsDrawerOpen();
  const dispatch = useDispatch();
  if(isDrawerOpen) dispatch(actions.drawer_turnon());
    else dispatch(actions.drawer_turnoff());

  const [logOutPop, setLogOutPop] = useState(false);

  return (
    // <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        {/* <Drawer.Section style={styles.up}> */}

          <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('Chat')} >
            <Image
              style={styles.icon}
              source={require('@/img/icon_communication.png')}
            />
            <Text style={styles.label}>留言聊天</Text>
            <Image
                style={styles.arrow}
                source={require('@/img/Btn_action-1.png')}
                resizeMode="contain"
              />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('Album')} >
            <Image
              style={styles.icon}
              source={require('@/img/icon_album.png')}
            />
            <Text style={styles.label}>活動相簿</Text>
            <Image
                style={styles.arrow}
                source={require('@/img/Btn_action-1.png')}
                resizeMode="contain"
              />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('News')} >
            <Image
              style={styles.icon}
              source={require('@/img/icon_news.png')}
            />
            <Text style={styles.label}>中心消息</Text>
            <Image
                style={styles.arrow}
                source={require('@/img/Btn_action-1.png')}
                resizeMode="contain"
              />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('Info')} >
            <Image
              style={styles.icon}
              source={require('@/img/icon_event.png')}
            />
            <Text style={styles.label}>活動資訊</Text>
            <Image
                style={styles.arrow}
                source={require('@/img/Btn_action-1.png')}
                resizeMode="contain"
              />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('Contact')} >
            <Image
              style={styles.icon}
              source={require('@/img/icon_contact.png')}
            />
            <Text style={styles.label}>聯絡我們</Text>
            <Image
                style={styles.arrow}
                source={require('@/img/Btn_action-1.png')}
                resizeMode="contain"
              />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate('Setting')} >
            <Image
              style={styles.icon}
              source={require('@/img/icon_setting.png')}
            />
            <Text style={styles.label}>會員設定</Text>
            <Image
                style={styles.arrow}
                source={require('@/img/Btn_action-1.png')}
                resizeMode="contain"
              />
          </TouchableOpacity>
            
          
        {/* </Drawer.Section> */}

        {/* <Drawer.Section style={styles.bottom}> */}
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.item} onPress={() => setLogOutPop(true)} >
            <Image
              style={styles.icon}
              source={require('@/img/icon_logout.png')}
            />
            <Text style={styles.label}>登出</Text>
            <Image
                style={styles.arrow}
                source={require('@/img/Btn_action-1.png')}
                resizeMode="contain"
              />
          </TouchableOpacity>
        </View>

            {logOutPop? (
              <PopOutOption
              text={'登出？'}
              butTextTop={'確定'}
              butTextBot={'返回'}
              butFuncTop={Services.logOut}
              butFuncBot={()=>setLogOutPop(false)}
              />
            ):(null)
            }
            
        {/* </Drawer.Section> */}
      </View>
    // </DrawerConten/tScrollView>
  );
}


const styles = StyleSheet.create({
  drawerContent: {
    // backgroundColor: 'red',
    marginTop: 10,
    height: '100%',
  },
  item:{
    // flex:1,
    width:'100%',
    height:50,
    flexDirection:'row',
    alignItems:'center',
    marginVertical:5,
    // backgroundColor:'red',
  },
  icon: {
    marginLeft:20,
    marginRight:40,
    width: 40,
    height: 40,
  },
  label:{
    color: '#A24982',
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrow:{
    height:18,
    width:20,
    marginLeft:'auto',
    marginRight:10,
  },
  up: {
    marginTop: -10,
  },
  bottom: {
    position: 'absolute',
    bottom: 20,
    
  },
});