import React, {useState, useEffect } from 'react';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image,SafeAreaView,FlatList} from 'react-native';
import { Avatar,IconButton } from 'react-native-paper';
import { Services } from '@/services/';
import { Chat} from '@/pages/Chat/handle_chat';
import { chatDatabase } from '@/services/ChatDatabase';
import { useFocusEffect } from '@react-navigation/native';
import{ useSelector,useDispatch } from 'react-redux';
import { AsyncStorage } from 'react-native';

function ChatScreen({navigation}) {
  const userData = useSelector(state => state.auth_state.userData);
  const [rooms,setRooms] = useState([]);
  const [loadedRooms,setLoadedRooms] = useState([]);
  const [update,setUpdate] = useState(0);

  useEffect(() => {
    navigation.setParams({
      // color_mode: 2,
      right: renderHeaderRight,
    });

    async function set_table() {
      try {
        await chatDatabase.setupDatabaseAsync();
        // await chatDatabase.dropDatabaseTablesAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    set_table();
    Services.get_rooms(
      (data)=>{
        setRooms(data);
        Chat.runSocket(data,refreshRooms);
        AsyncStorage.setItem('rooms', JSON.stringify(data));
      },
      getRoomsFromStorage
    );
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      refreshRooms();

      return () => {};
    }, [])
  );
  
  const refreshRooms = () => {
    Services.get_rooms(
      (data)=>{
        setRooms(data);
        Chat.joinRooms(data);
        AsyncStorage.setItem('rooms', JSON.stringify(data));
      },
      getRoomsFromStorage
    );
  }

  const sortRooms = () => {
    // if(rooms.length>0){
    //   let rooms_ = rooms;
    //   rooms_.sort(function (a, b) {
    //     return (b.message_id) - (a.message_id);
    //   });
    //   setRooms(rooms_);
    //   AsyncStorage.setItem('rooms', JSON.stringify(rooms_));
    //   setUpdate(update+1);
    // }

    // AsyncStorage.setItem('rooms', JSON.stringify(rooms));
  }

  
  const getRoomsFromStorage = async() => {
    const roomsStored = await AsyncStorage.getItem('rooms');
    console.log('a',roomsStored);
    if(roomsStored) setRooms(JSON.parse(roomsStored));
  } 

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => {navigation.push('search_user_list')} }
    >
       <IconButton
          icon={({ size}) => (
            <Image
              source={require('@/img/Btn_add_chat.png')}
              style={{ width: size, height: size, resizeMode:'contain'}}
            />
          )}
          size={30}
        />
    </TouchableOpacity>
  )

  const renderItem = ({item}) => {
    let pic,title,bg,textColor,status; 
    let other = 0; 

    if(item.isPrivate){
      if (item.users.length>1 && item.users[other].id == userData.id) other = 1;
      pic = item.users[other].pic;
      title = item.users[other].name;

      if(item.users[other].online_status=='online' ){
        bg = 'white'; 
        textColor='#a7589c';
        status='';
      }
      else{
        bg = '#cbcbcb';
        textColor='#606060';
        status='離線中';
        // status='';
      }
    }
    else {
      pic = item.pic;
      title = item.title;
      bg = '#a7589c';
      textColor='#FFFFFF';
      status='';
    }

    return(
      <TouchableOpacity style={[styles.item,{backgroundColor: bg}]} 
        onPress = { () => {
          let loaded = loadedRooms.includes(item.id);
          navigation.push('chatroom', {group:item,loaded:loaded,loadRoom:(room)=>setLoadedRooms(loadedRooms.concat([room]))})
        }}
      >
        <View style={styles.itemTop}>
          <Avatar.Image size={40} style={{backgroundColor:'rgba(0,0,0,0.1)'}} source={{ uri: pic }} />
          <Text style={[styles.title,{color: textColor}]}>{title}</Text>
          {item.unread>0 ? <View style={styles.number}><Text style={{fontSize: 20}}>{item.unread}</Text></View> :  <Text style={[styles.status,{color: textColor}]}>{status}</Text> }
        </View>
        {/* <View style={styles.itemBottom}>
          <Text style={styles.itemBottomText}>{item.body}</Text>
        </View> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <ImageBackground
          style={{width: '100%', height: '100%'}}
          resizeMode='cover' 
          source={require('@/img/background-6.png')}
      >
        <View style={styles.container}> 
          <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            extraData={update}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  item: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.16,
    shadowRadius: 2.88,
    elevation: 6,
  },
  itemTop:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBottom:{
    marginLeft:55,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemBottomText:{
    fontSize: 13,
    color:'#444444',
    // fontStyle:'italic',
  },
  title: {
    marginLeft: 12,
    fontSize: 20,
  },
  status: {
    marginLeft: 'auto',
    fontSize: 20,
  },
  number: {
    marginLeft: 'auto',
    width: 30,
    height: 30,
    borderRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bbe1f8',
    color: '#606060',
  },
});

export default ChatScreen;