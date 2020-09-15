import React, { useState, useEffect } from 'react';
import { View,Image ,FlatList, SafeAreaView, ImageBackground, StyleSheet, Text, RefreshControl, TouchableOpacity, ScrollView} from "react-native";
import { Services } from '@/services/';
import { useFocusEffect } from '@react-navigation/native';

function NewsScreen({navigation}) {
  const [data, setData] = useState([]);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(2);

  const init = () => {
    Services.get('news?page=1',(data) => setData(data.data));
    setPage(2);
    setEnd(false);
  }

  //refresh
  const [refreshing, setRefreshing] = React.useState(false);

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

  useFocusEffect(
    React.useCallback(() => {
      init();

      return () => {};
    }, [])
  );

  const addToData = (newData) => {
    if(newData.data.length>0) {
      setData(data.concat(newData.data) );
      setPage(page+1);
    }
      else setEnd(true);
  }

  const renderItem = ({item}) => {

    return (
      <TouchableOpacity onPress={() => navigation.push('detail',  {item: item})} style={styles.item}>
      <View style={styles.row}>
        <View style>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>2019-0-1</Text>
          {/* {item.date_for_display} */}
        </View>
        <View style = {{width:50,height:50}}>
          <Image 
              source={{ uri: item.pic }}
              style={{height:'100%'}}
              resizeMode="contain"
        />
        </View>
      </View>
      <Text numberOfLines={3} style={styles.content}>{item.description}</Text>
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
            onEndReached={(e) => {
              if(!end) Services.get('news?page='+(page),addToData);
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            // extraData={}
          />
        </View>

      </ImageBackground>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    width: '100%',
    // backgroundColor: 'green',
    display:'flex',
    // flexWrap: 'nowrap',
    flexDirection:'row',
    justifyContent: 'space-between',
    // flex: 0,
  },
  item: {
    padding: 20,
    backgroundColor: '#eef4f7',
    marginVertical: 8,
    // marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
    color: '#994278',
  },
  date: {
    fontSize: 12,
    marginBottom: 8,
    color: '#5f5f5f',
  },
  content: {
    fontSize: 17,
    color: '#5f5f5f',
  },
});

export default NewsScreen;