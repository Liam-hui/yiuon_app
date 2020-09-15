import React, {useState, useEffect } from 'react';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,Image,RefreshControl,SafeAreaView,FlatList} from 'react-native';
import { IconButton } from 'react-native-paper';
import { Services } from '@/services/';
import { useFocusEffect } from '@react-navigation/native';
import{useSelector,useDispatch} from 'react-redux';

function AlbumScreen({ navigation,route}) {
  const [data, setData] = useState([]);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(2);

  const member_type = useSelector(state => state.auth_state.userType);

  const init = () => {
    Services.get('albums?page=1',(data)=>setData(data.data) );
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

  useEffect(() => {
    if(member_type=='staff'){
      navigation.setParams({
        right: renderHeaderRight,
      });
    }
  }, []);

  const addToData = (newData) => {
    if(newData.data.length>0) {
      setData(data.concat(newData.data) );
      setPage(page+1);
    }
      else setEnd(true);
  }

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('add-photo',  {newAlbum: true})}
    >
        <IconButton
          icon="plus"
          color={'#000000'}
          size={30}
        />
    </TouchableOpacity>
  )

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('detail',  {title:item.title, item: item})} style={styles.item} >
        <Image 
          source={{ uri: item.pic}}
          style={{width:'100%', height:'100%'}}
          resizeMode="cover"
        />
        <View style={styles.title}>
          <Text style={{color: '#A24982',fontSize:20}}>{item.title}</Text>
        </View>
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
              if(!end) Services.get('albums?page='+(page),addToData);
            }}
            data={data}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={item => item.id.toString()}
            // extraData={selectedId}
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
  item: {
    width: '100%',
    height:230,
    marginBottom: 5,
  },
  title: {
    marginTop: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.6)'
  },
});

export default AlbumScreen;