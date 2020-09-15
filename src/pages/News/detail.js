import React, { useState, useEffect } from 'react';
import {Image, ScrollView, View, ImageBackground, StyleSheet, Text, Dimensions, SafeAreaView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

function NewsDetail({route, navigation}) {

  const {item} = route.params;
  const [ratio, setRatio] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      Image.getSize(item.pic, (w, h) => { 
        setRatio(w/h);
      });

      return () => {};
    }, [])
  );

  return (
    <SafeAreaView>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-6.png')}
      >
        <ScrollView>
          <Image 
              source={{ uri: item.pic }}
              style={{width:'100%', height: Dimensions.get('window').width * ratio}}
              resizeMode="contain"
          />
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text> 
            <Text style={styles.text}>{item.description}</Text>
          </View>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    color: '#994278',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#5f5f5f',
  },
  line: {
    width: '100%',
    flex:0,
    flexDirection: 'row',
  },
  date: {
    position: 'absolute',
    right:0,
    bottom:0,
  },
});

export default NewsDetail;
