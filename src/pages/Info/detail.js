import React, { useState, useEffect } from 'react';
import {Image, SafeAreaView, View, ImageBackground, StyleSheet, Text, Dimensions, TouchableOpacity,TouchableWithoutFeedback } from "react-native";
import { Services } from '@/services/';

function InfoDetail({route, navigation}) {
  let {item,index} = route.params;
  if (item.is_fav) item.is_fav=true; else item.is_fav=false;
  const [fav,setFav] = useState(item.is_fav);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    Image.getSize(item.pic, (w, h) => { 
      setRatio(w/h);
    });
  }, []);

  let like_url = require("@/img/icon_like-3.png") ;
  if(fav) like_url = require("@/img/icon_like-2.png");

  return (
     <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-6.png')}
      >
      <SafeAreaView style={styles.container}>
        <Image 
            source={{ uri: item.pic }}
            style={{width:'100%', height: Dimensions.get('window').width * ratio}}
            resizeMode="contain"
        />
        <View style={styles.content}>
          <View style={styles.line}>
          <Text numberOfLines={1} style={styles.title}>{item.title}</Text> 
          <TouchableWithoutFeedback
            style={styles.icon}
            onPress={() => {
              Services.fav_toggle(item.id);
              setFav(!fav);
              route.params.change(index);
            }}
           >
            <Image 
              source={like_url}
              style={styles.icon}
              resizeMode="center"
            />
          </TouchableWithoutFeedback>
          </View>
          <Text style={styles.text}>活動日期： {item.date}</Text>
          <Text style={styles.text}>活動時間： {item.time}</Text>
          <Text style={styles.text}>{item.detail}</Text>
        </View>

      </SafeAreaView>
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
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
  },
  icon: {
    position: 'absolute',
    right:0,
    height: 18,
    width: 18,
    marginRight: 5,
  },
});

export default InfoDetail;
