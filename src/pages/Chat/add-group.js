import React, {useState, useEffect } from 'react';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image,SafeAreaView,FlatList,TextInput,ScrollView } from 'react-native';
import { Avatar} from 'react-native-paper';
import FormButton from '@/components/FormButton';
import FormInput from '@/components/FormInput';
import { useFocusEffect } from '@react-navigation/native';
import {PickImage} from '@/components/PickImage';
import { Services } from '@/services/';

function AddNewGroupScreen({navigation,route}) {

  const {new_members} = route.params;
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');
  const [warning, setWarning] = useState(' ');

  useFocusEffect(
    React.useCallback(() => {

    return () => {};
    }, [])
  );

  useEffect(() => {
    navigation.setParams({
      pop: navigation.goBack,
    });

  }, []);

  const handleSubmit = () => {
    if (title!='') Services.create_group(new_members,title,icon,(data)=>navigation.push('chatroom',  {group:data}) );
      else setWarning('請輸入群組名稱!');
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={()=>{}} style={styles.item}>
        <Avatar.Image size={35} style={{backgroundColor:'rgba(0,0,0,0.1)'}}  source={{uri:item.pic}} />
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
              <View style={styles.top}>
                  <View style={{flex:0, flexDirection:'row', alignItems:'center'}}>
                      <Avatar.Image size={130} style={{backgroundColor:'rgba(0,0,0,0.1)'}} source={{uri:icon}} />
                      <TouchableOpacity style={styles.changeIcon}>
                        <Text style={styles.changeIconText} onPress={()=>{PickImage(setIcon);}}>更改頭像</Text>
                      </TouchableOpacity>
                  </View>
                  {/* <View style={[styles.inputWrapper,{marginTop:15}]}> */}
                  <FormInput
                    placeholder={'群組名稱'}
                    addStyle={{marginTop:20}}
                    value={title}
                    onChangeText={title => {setTitle(title);setWarning(' ');}}
                  />
                  {/* </View> */}
              </View>

            <View style={styles.toggle}>
                <Text style={{color: '#A24982',fontSize:18}}>信息提示</Text>
                <Text style={styles.toggleRight}>開></Text>
            </View>

            <Text style={{marginLeft:20, color: '#A24982',fontSize:18}}>群組成員：{new_members.length} 人</Text>
            <View style={{paddingHorizontal:15, backgroundColor:'#f5f9e8', marginTop:8}}>
                <FlatList
                data={new_members}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                // extraData={selectedId}
                />
            </View>

            <View style={styles.bottom}>
              <Text style={styles.warning}>{warning}</Text>
              <FormButton
                  title='建立'
                  onPress={()=>handleSubmit()}
                  labelStyle={{fontSize: 18}}
              />
            </View>

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
  warning:{
    fontSize:15,
    fontWeight: '600',
    marginBottom:5,
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
    marginTop: 20,
    marginBottom:30,
  }
});

export default AddNewGroupScreen;