import React, { useState, useEffect } from 'react';
import { FlatList, Image, SafeAreaView, View, ImageBackground, StyleSheet, RefreshControl, Text, TouchableOpacity,TouchableWithoutFeedback,AsyncStorage } from "react-native";
import { Services } from '@/services/';
import { useFocusEffect } from '@react-navigation/native';

function InfoScreen({navigation}) {
  const [data,setData] = useState([]);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(2);
  const [update,setUpdate] = useState(0);
  const [fav,setFav] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const init = () =>{
    Services.get('events?page=1'+fav,(data) => setData(data.data) );
    setPage(2);
    setEnd(false);
  }

  useEffect(() => {
    init();
  }, []);

  //refresh
  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    init();

    wait(1000).then(() => setRefreshing(false));
  }, []);

  const addToData = (newData) => {
    if(newData.data.length>0) {
      setData(data.concat(newData.data) );
      setPage(page+1);
      // console.log(newData);
    }
      else setEnd(true);
  }

  const change_like = (index) => {
    let data_ = data.slice();
    data_[index].is_fav = !data_[index].is_fav;
    setData(data_);
    setUpdate(update+1);
  }

  const renderItem = ({item,index}) => {
    let like_url = require("@/img/icon_like-3.png") ;
    if(item.is_fav) like_url = require("@/img/icon_like-2.png");
    return(
      <TouchableOpacity 
        onPress={() => navigation.navigate('detail',  {item: item, index:index, change:change_like}) }
        style={[styles.item]}
      >
        <Image 
          source={{ uri: item.pic }}
          style={styles.image}
        />
        <View style={styles.content}>
          <View style={styles.line}>
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text> 

            <TouchableWithoutFeedback
              onPress={() => {
                Services.fav_toggle(item.id);
                change_like(index);
              }}
            >
              <Image 
                source={like_url}
                style={styles.icon}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>

          </View>
          {/* <Text style={styles.text}>活動日期： {item.date_for_display}</Text> */}
          {/* <Text style={styles.text}>活動時間： {item.time}</Text> */}
        </View>
        
      </TouchableOpacity>
  )};

  return (
    <SafeAreaView>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-6.png')}
      >
      <View style={styles.container}> 
        
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          setFav('&favFirst=y');
          Services.get('events?page=1&favFirst=y',(data) => setData(data.data) );
          setPage(2);
          setEnd(false);
        }}
      >
        <Text style={styles.buttonText}>以</Text>
        <Image 
          source={require('@/img/icon_like-1.png')}
          style={{width:20, height:20, marginHorizontal:4}}
          resizeMode="contain"
        />
        <Text style={styles.buttonText}>優先</Text>
      </TouchableOpacity>         
        
        <FlatList
          onEndReached={(e) => {
            if(!end) Services.get('events?page='+page+fav,addToData);
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          extraData={update}
          style={{width:'100%'}}
        />

      </View>
      </ImageBackground>
    </SafeAreaView>

  );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width:'70%',
    height: 40,
    marginVertical: 10,
    backgroundColor: '#A24982',
    flex:0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  item: {
    flex:1,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#eef4f7',
    marginBottom: 8,
    alignItems: 'center',
  },
  content: {
    width: '60%',
    marginLeft: 'auto',
    height: '100%',
  },
  title: {
    width: '90%',
    fontSize: 20,
    // marginBottom: 20,
    color: '#994278',
  },
  text: {
    fontSize: 18,
    marginVertical: 2,
    color: '#5f5f5f',
  },
  line: {
    flex:0,
    flexDirection: 'row',
    // backgroundColor: 'red',
    height: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: '35%',
    height: 90,
    resizeMode: 'cover',
    // backgroundColor: 'red'
  },
  icon: {
    position: 'absolute',
    right:0,
    height: 18,
    width: 18,
    marginRight: 5,
  },
});

export default InfoScreen;
