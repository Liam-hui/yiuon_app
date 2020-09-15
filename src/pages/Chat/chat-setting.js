import React, {useState, useEffect } from 'react';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image,SafeAreaView,FlatList,TextInput,ScrollView } from 'react-native';
import { Avatar} from 'react-native-paper';
import FormButton from '@/components/FormButton';
import { useFocusEffect } from '@react-navigation/native';
import{useSelector,useDispatch} from 'react-redux';
import {PickImage} from '@/components/PickImage';
import { Services } from '@/services/';
import PopOutOption from '@/components/PopOutOption';
import {Chat} from '@/pages/Chat/handle_chat';

function ChatSettingScreen({navigation,route}) {

  const userData = useSelector(state => state.auth_state.userData);
  const member_type = useSelector(state => state.auth_state.userType);
  let {group,other,title} = route.params;
  const [newTitle, setNewTitle] = useState('');

  const [memberPop, setMemberPop] = useState(false);
  const [groupPop, setGroupPop] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      setNewTitle(title);
      navigation.setParams({
          pop: ()=> {route.params.onGoBack(group); navigation.goBack();},
      });

    return () => {};
    }, [])
  );

  const handle_press = (item) => {
    setSelectedItem(item);
    setMemberPop(true);
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onLongPress={()=>{handle_press(item)}} style={styles.item}>
        <Avatar.Image size={35} style={{backgroundColor:'rgba(0,0,0,0.1)'}} source={{uri:item.pic}} />
        <Text style={styles.name}>{item.name}</Text>
        {/* <Text style={styles.status}>管理員</Text> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-1.png')}
      >
        <View style={styles.container}>
          <ScrollView>

            {group.isPrivate==1 || member_type=='user'? ( 
              <View style={styles.top}>
                <View style={{flex:0, alignItems:'center'}}>
                  <Avatar.Image size={150} style={{backgroundColor:'rgba(0,0,0,0.1)'}}  
                    source={group.isPrivate==0?({uri:group.pic}):({uri:group.users[other].pic})} 
                  />
                </View>
              </View>
            ):(null)
            }

            {member_type=='staff' && group.isPrivate==0? ( 
              <View style={styles.top}>
                  <View style={{flex:0, flexDirection:'row', alignItems:'center'}}>
                      <Avatar.Image size={130} style={{backgroundColor:'rgba(0,0,0,0.1)'}} source={{uri:group.pic}} />
                      <TouchableOpacity style={styles.changeIcon}>
                        <Text style={styles.changeIconText} onPress={()=>{PickImage();}}>更改頭像</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={[styles.inputWrapper,{marginTop:15}]}>
                    <TextInput 
                        style={styles.input}
                        value={newTitle}
                        onChangeText={title => {setNewTitle(title);}}
                    />
                    <TouchableOpacity style={styles.enterButton} onPress = {() => {Services.update_group(group.id,newTitle,()=> { group.title=newTitle; navigation.setParams({title:newTitle}); route.params.changeTitle(newTitle); } )}}>
                      <Text style={styles.enterButtonText}>確定</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            ):(null)
            }

            <View style={styles.toggle}>
                <Text style={{color: '#A24982',fontSize:18}}>信息提示</Text>
                <Text style={styles.toggleRight}>開></Text>
            </View>

            {group.isPrivate==0? (
              <>
                <Text style={{marginLeft:20, color: '#A24982',fontSize:18}}>群組成員：{group.users.length} 人</Text>
                <View style={{paddingHorizontal:15, backgroundColor:'#f5f9e8', marginTop:8}}>
                    <FlatList
                    data={group.users}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    // extraData={selectedId}
                    />
                </View>
              </>
            ):(null)
            }

            {member_type=='staff' && group.isPrivate==0? ( 
              <TouchableOpacity onPress={() =>  {
                navigation.push('search_user_list',{add_member:true, title:title, id:group.id,exist_members:group.users,onGoBack: (added) => group.users = group.users.concat(added)  })} 
              }>
                <Text style={[styles.item,styles.add]}>+增加成員</Text>
              </TouchableOpacity>
            ):(null)
            }

            {member_type=='staff'?( 
              <View style={styles.bottom}>
                  <FormButton
                      title={group.isPrivate==0? ('刪除群組'):('刪除對話')}
                      onPress={()=>setGroupPop(true)}
                      // addStyle={{marginTop:30}}
                      labelStyle={{fontSize: 18}}
                  />
              </View>
            ):(null)
            }

            {memberPop? (
              <PopOutOption
              close={()=>setMemberPop(false)}
              avatar={selectedItem.pic}
              text={selectedItem.name}
              butTextTop={'與'+selectedItem.name+'聊天'}
              butTextBot={member_type=='staff'? ('把'+selectedItem.name+'移除'):(null)}
              butFuncTop={()=>{
                Services.two_people_chat(selectedItem.id,(group)=>navigation.push('chatroom',  {group:group}));
                setMemberPop(false);
              }}
              butFuncBot={()=>Services.remove_member_from_group(group.id,selectedItem.id,()=>{
                group.users = group.users.filter(x => x.id!=selectedItem.id);
                console.log('bbb',group.id,userData.id);
                Chat.messageSystem(group.id,userData.id);
                Chat.kickMember([selectedItem]);
                setMemberPop(false);
              })}
              />
            ):(null)
            }

            {groupPop? (
              <PopOutOption
              close={()=>setGroupPop(false)}
              text={group.isPrivate==0? ('清除群組對話內容？'):('清除對話內容？')}
              butTextTop={'確定'}
              butTextBot={'返回'}
              butFuncTop={()=>{Services.delete_group(group.id,() => {
                navigation.popToTop(); 
                Chat.kickMember(group.users);
              } )}}
              butFuncBot={()=>setGroupPop(false)}
              />
            ):(null)
            }

          </ScrollView>       
        </View>
      </ImageBackground>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  memberwrapper: {
    paddingHorizontal: 15,
    backgroundColor: '#f5f9e8',
  },
  item: {
    fontSize: 18,
    width: '100%',
    flex:0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#ccaebf'
  },
  name: {
    fontSize: 18,
    marginLeft: 12,
    color: '#994278',
  },
  status: {
    fontSize: 18,
    marginLeft: 'auto',
    color: '#994278',
  },
  add: {
    textAlign: 'center',
    color: '#994278',
    backgroundColor: 'white',
    marginTop: -1,
  },
  toggle:{
    flex:0,
    flexDirection: 'row',
    alignItems: 'center',
    color: '#994278',
    backgroundColor:'#f5f9e8',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  toggleRight:{
    fontSize:18,
    color:'black',
    marginLeft: 'auto'
  },
  top: {
    paddingHorizontal:40,
    marginVertical: 20,
  },
  changeIcon: {
    backgroundColor: '#A24982',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 5,
    overflow: 'hidden',
    marginLeft: 'auto',
  },
  changeIconText:{
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  inputWrapper: {
    flex:0,
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },
  input: {
    flex:1,
    fontSize: 18,
    margin: 0,
    paddingHorizontal: 10,
    height: 22,
    color: '#A24982',
    borderWidth: 0,
  },
  enterButton: {
    backgroundColor: '#A24982',
    marginLeft: 'auto',
    width:100,
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: 8,
  },
  enterButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  bottom:{
    paddingHorizontal:30,
    marginTop: 30,
    marginBottom:30,
  }
});

export default ChatSettingScreen;