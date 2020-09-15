import React, {useState, useEffect } from 'react';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image,SafeAreaView,FlatList,TextInput,ScrollView } from 'react-native';
import { Avatar} from 'react-native-paper';
import FormButton from '@/components/FormButton';

const DATA = [
  {
    id: "1",
    title: "消息名稱",
    date: "27/10/2016",
    content: "消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容"
  },
  {
    id: "2",
    title: "消息名稱",
    date: "27/10/2016",
    content: "消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容"
  },
  {
    id: "3",
    title: "消息名稱",
    date: "27/10/2016",
    content: "消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容消息內容"
  },
];

const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
     <Avatar.Image size={35} source={require('@/img/avatar.jpg')} />
    <Text style={styles.name}>李婆婆</Text>
    <Text style={styles.number}>0127812</Text>
    <Text style={styles.status}>+</Text>
    {/* <Text style={styles.date}>{item.date}</Text> */}
    {/* <Text numberOfLines={3} style={styles.content}>{item.content}</Text> */}
  </TouchableOpacity>
);


function AddMemberScreen({navigation}) {
  const [selectedId, setSelectedId] = useState(null);

  const [value, onChangeText] = React.useState('唱遊小組 - 2');
  const renderItem = ({ item }) => {

    return (
      <Item
        item={item}
        // onPress={() => navigation.navigate('chatroom',  {item: item})}
        // onPress={() => setSelectedId(item.id)}
        // style={{ backgroundColor }}
      />
    );
  };

  return (
    <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-1.png')}
    >
        <SafeAreaView style={styles.container}>
        
            <View style={{paddingHorizontal:20}}>
                <View style={styles.search}>
                        <TextInput 
                            style={styles.searchText}
                            onChangeText={text => onChangeText(text)}
                            value={value}
                        />
                        <Text style={styles.searchButton}>確定</Text>
                </View>
            </View>

            <View style={{paddingHorizontal:15, backgroundColor:'#f5f9e8', marginTop:8}}>
                <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
                />
            </View>
      
        </SafeAreaView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    
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
  number: {
    fontSize: 16,
    marginLeft: 12,
    color: '#994278',
  },
  status: {
    fontSize: 18,
    marginLeft: 'auto',
    color: '#994278',
  },
  top: {
    paddingHorizontal:40,

  },
  search: {
    flex:0,
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 15,
  },
  searchText: {
    fontSize: 18,
    margin: 0,
    padding: 0,
    height: 22,
    color: '#A24982',
    marginLeft: 10,
    borderWidth: 0,
  },
  searchButton: {
    color: 'white',
    backgroundColor: '#A24982',
    paddingVertical: 8,
    paddingHorizontal: 30,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 'auto',
  },
});

export default AddMemberScreen;