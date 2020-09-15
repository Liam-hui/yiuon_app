import React, {useState, useEffect } from 'react';
import { View, StyleSheet,ImageBackground,TouchableOpacity,Image,SafeAreaView,FlatList} from 'react-native';
import { IconButton } from 'react-native-paper';
import { Services } from '@/services/';
import { useFocusEffect } from '@react-navigation/native';
import MediaFull from '@/components/MediaFull';

function AlbumDetailScreen({ route, navigation}) {

  const {item} = route.params;
  const [data, setData] = useState([]);
  const [end, setEnd] = useState(false);
  const [page, setPage] = useState(2);
  const [full, setFull] = useState(null);


  useFocusEffect(
    React.useCallback(() => {
      Services.get('album/'+item.id+'?page=1',(data)=>setData(data.photos.data) );
      setPage(2);
      setEnd(false);

      return () => {};
    }, [])
  );

  useEffect(() => {
    navigation.setParams({
      color_mode: 1,
      right: renderHeaderRight,
    });
  }, []);

  const addToData = (newData) => {
    if(newData.photos.data.length>0) {
      setData(data.concat(newData.photos.data) );
      setPage(page+1);
    }
      else setEnd(true);
  }

  const renderHeaderRight = () => (
    <TouchableOpacity
        onPress={() => navigation.push('add-photo',  {item: item, newAlbum: false})}
    >
      <IconButton
        icon="plus"
        color={'#000000'}
        size={30}
      />
    </TouchableOpacity>
  )

  const renderItem  = ({item}) => {
    let showFull=false;
    if(full==item.id) showFull=true;
    return (
      <>  
        <TouchableOpacity style={styles.item} onPress={()=>{setFull(item.id)}}>
          <Image 
              source={{ uri: item.pic}}
              style={{width:'100%', height:'100%'}}
              resizeMode="cover"
          />
        </TouchableOpacity>
        {showFull?(
          <MediaFull
          content={(
              <Image style={{ width:'100%', height:'100%',resizeMode:'contain'}} source={{ uri: item.pic }}/>
          )}
          close={()=>setFull(null)}
          uri={item.pic}
        />
        ):(null)} 
      </>
    )
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
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              onEndReached={(e) => {
                if(!end) Services.get('album/'+item.id+'?page='+page,addToData);
              }}
              extraData={full}
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
    marginBottom: 3,
  },
  imageActive: {
    // flex: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#342733',
  },
});

export default AlbumDetailScreen;