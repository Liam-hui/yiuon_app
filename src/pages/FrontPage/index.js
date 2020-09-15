import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Dimensions, Text,TouchableOpacity,SafeAreaView} from 'react-native';

export default function FrontPageScreen({navigation}) {
  
  return (
    <SafeAreaView>
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      resizeMode='cover' 
      source={require('@/img/background-4.jpg')}
    > 
      {/* <View> */}
      <View style={{position:'absolute',right:20,top:40,flex:0,alignItems:'flex-end'}}>
        <Text style={{fontSize:20,color:'#a04a97',marginBottom:3}}>年老的有智慧,壽高的有知識</Text>
        <Text style={{fontSize:16,color:'#111111'}}>《約伯記第12章：12節》</Text>
      </View>

      <View style={styles.container}>

        <View style={{width:'100%', height:'100%',position:'absolute',justifyContent:'center',alignItems:'center',}}>
          <View style={{width:'90%',height:1,backgroundColor:'#a04a97'}}></View>
        </View>

        <View style={{width:'100%', height:'100%',position:'absolute',justifyContent:'center',alignItems:'center',}}>
          <View style={{height:'90%',width:1,backgroundColor:'#a04a97'}}></View>
        </View>

        <View style={styles.row}>

          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Chat')} >
            <Image 
              source={require('@/img/menu_communication.png')}
              style={{width:'100%', height:'75%'}}
              resizeMode="contain"
            />
            <Text style={styles.text}>留言聊天</Text>
            <Image 
              source={require('@/img/Btn_action-2.png')}
              style={{width:20, height:18, position:'absolute', bottom:12, right:22}}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Album')} >
            <Image 
              source={require('@/img/menu_album.png')}
              style={{width:'100%', height:'75%'}}
              resizeMode="contain"
            />
            <Text style={styles.text}>活動相簿</Text>
            <Image 
              source={require('@/img/Btn_action-2.png')}
              style={{width:20, height:18, position:'absolute', bottom:12, right:22}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
        </View>

        <View style={styles.row}>

          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('News')} >
            <Image 
              source={require('@/img/menu_news.png')}
              style={{width:'100%', height:'75%'}}
              resizeMode="contain"
            />
            <Text style={styles.text}>中心消息</Text>
            <Image 
              source={require('@/img/Btn_action-2.png')}
              style={{width:20, height:18, position:'absolute', bottom:12, right:22}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Info')} >
            <Image 
              source={require('@/img/menu_event.png')}
              style={{width:'100%', height:'75%'}}
              resizeMode="contain"
            />
            <Text style={styles.text}>活動資訊</Text>
            <Image 
              source={require('@/img/Btn_action-2.png')}
              style={{width:20, height:18, position:'absolute', bottom:12, right:22}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
        </View>

      </View>
    </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
    height:Dimensions.get('window').width,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255,255,255,0.6)',
    flex:0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    // backgroundColor:'red',
    width: '50%',
    height: '100%',
    paddingVertical: 10,
    flex:0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    height: '50%',
    flexDirection: 'row',
  },
  text: {
    fontSize: 22,
    color: 'rgb(104,104,104)'
  }
});