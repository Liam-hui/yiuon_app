import React, {useState, useEffect } from 'react';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image,SafeAreaView,FlatList,TextInput,ScrollView } from 'react-native';
import { Avatar} from 'react-native-paper';
import { Services } from '@/services/';
import { useFocusEffect } from '@react-navigation/native';
import{useSelector,useDispatch} from 'react-redux';
import {Chat} from '@/pages/Chat/handle_chat';

function SearchUserListScreen({navigation,route}) {
  const userData = useSelector(state => state.auth_state.userData);
  const {add_group,add_member,exist_members,id} = route.params;
  const member_type = useSelector(state => state.auth_state.userType);

  const [keyword, setKeyword] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [warning, setWarning] = useState(' ');

  const [data, setData] = useState([]);
  const [end, setEnd] = useState(false);
  const [initDone, setInitDone] = useState(false);
  const [page, setPage] = useState(1);


  useFocusEffect(
    React.useCallback(() => {

      if(add_group) navigation.setParams({
        title:'新增群組',
      });

      return () => {};
    }, [])
  );

  useEffect(() => {
    navigation.setParams({
      pop: navigation.goBack,
    });
  }, []);

  
  useEffect(() => {
    if(!initDone) {
      if(!end && data.length<15) Services.get('user/list?page='+(page)+'&keyword='+search,addToData);
      else setInitDone(true);
    }
  }, [data]) 

  const init = () => {
    setPage(1);
    setEnd(false);
    setInitDone(false);
    setData([]);
  }

  const addToData = (newData) => {
    if(newData.data.length>0) {
      setPage(page+1);
      setData(data.concat(filter_exist_member(newData.data)) );
    }
      else setEnd(true);
  }

  const filter_exist_member = (data) => {
    if(add_member){
      exist_members.forEach(member=>{
        data = data.filter(x => x.id!=member.id)
      })
    }
    return data;
  }

  useEffect(() => {
    if(keyword==''&&search!=''){
      init();
      setSearch('');
    }
  }, [keyword]) 


  const choose_chat = (id) => {
    Services.two_people_chat(id,(data)=>navigation.push('chatroom',  {group:data,newRoom:true}) );
  }

  const renderItem = ({item}) => {
    let bg,textColor,status;  
    let isSelected = false;
    for(let i = 0; i < selected.length; i++) {
      if (selected[i].id == item.id) {
        isSelected = true;
        break;
      }
    }
    if(isSelected) {bg = '#a7589c'; textColor='#FFFFFF'; status='';}
      else if(item.online_status=='online') {bg = 'white'; textColor='#a7589c'; status='在線'} 
        else {bg ='#cbcbcb'; textColor='#606060'; status='離線中'}
    return(
      <TouchableOpacity style={[styles.item,{backgroundColor: bg}]} onPress={()=>{
          if(add_group||add_member) {
            setWarning('');
            if(isSelected) {
              setSelected(selected.filter(x => x.id != item.id));
            }
            else {
              setSelected(selected.concat(item))
            }
          }
          else choose_chat(item.id);
        }}
      >
        <Avatar.Image size={40} style={{backgroundColor:'rgba(0,0,0,0.1)'}} source={{ uri: item.pic }} />
        <Text style={[styles.name,{color: textColor}]}>{item.name}</Text>
        <Text style={[styles.status,{color: textColor}]}>{status}</Text> 
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
        
          <View style={{paddingHorizontal:20, marginTop:20,marginBottom:15}}>
            <View style={styles.inputWrapper}>
              <TextInput 
                  style={styles.input}
                  placeholder="搜尋名稱"
                  onChangeText={text => {setKeyword(text);}}
              />
              <TouchableOpacity style={styles.enterButton} onPress={()=>{
                setSearch(keyword);
                init();
              }}>
                <Text style={styles.enterButtonText}>搜尋</Text>
              </TouchableOpacity>
            </View>
          </View>

          {!add_group && !add_member && member_type=='staff'? ( 
            <TouchableOpacity onPress={() => {navigation.push('search_user_list',{add_group:true})} }style={styles.button}>
                <Text style={{fontSize: 18,color:'#A24982'}}>新增群組</Text>
            </TouchableOpacity>
           ):(null)
          }

          <View style={{flex:1}}>
            <FlatList
              contentContainerStyle={{marginTop:10,width:'100%',alignItems:'center'}}
              // onScroll={event=> {handleScroll(event);}}
              data={data}
              onEndReached={(e) => {
                if(initDone) Services.get('user/list?page='+(page)+'&keyword='+search,addToData);
              }}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              extraData={search,selected}
            />
          </View>

          { (add_group||add_member) && member_type=='staff'? ( 
            <>
            <Text style={styles.warning}>{warning}</Text>
            <TouchableOpacity style={[styles.button,{marginBottom:15}]} onPress={() => {
                if(add_group){
                  if(selected.length<=1) setWarning('請最少選擇兩名成員！');
                  else navigation.push('add-group',{new_members:selected});
                }

                if(add_member&&selected.length>0){
                  Services.add_member_to_group(id,selected,()=>{
                    console.log('aaa',id,userData.id);
                    Chat.messageSystem(id,userData.id);
                    Chat.kickMember(selected);
                    route.params.onGoBack(selected);
                    navigation.goBack({added:selected});
                  })
                }
              }}
            >
                <Text style={{fontSize: 18,color:'#A24982'}}>
                  {add_group? '下一步':'+增加成員'}
                  </Text>
            </TouchableOpacity>
            </>
           ):(null)
          }
      
        </View>
        
      </ImageBackground>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:10,
  },
  warning:{
    fontSize:15,
    fontWeight: '500',
    marginTop:10,
    marginBottom:5,
  },
  item: {
    height:60,
    width: '100%',
    flex:0,
    flexDirection: 'row',
    alignItems: 'center',
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
  button: {
    width: '100%',
    paddingHorizontal:20,
    paddingVertical:8, 
    backgroundColor:'white',
    marginBottom:5,
    alignItems:'center',
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.16,
    shadowRadius: 2.88,
    elevation: 6,
  },
  status: {
    marginLeft: 'auto',
    fontSize: 20,
  },
  name: {
    marginLeft: 12,
    fontSize: 20,
  },
  status: {
    fontSize: 18,
    marginLeft: 'auto',
    color: '#606060',
    marginRight:10,
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
});

export default SearchUserListScreen;