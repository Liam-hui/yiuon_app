import React from 'react';
import { ImageBackground, SafeAreaView, Image, View, StyleSheet, Text, ScrollView, Dimensions } from "react-native";
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

function ContactScreen() {

  return (

    <SafeAreaView>
      <ImageBackground
        style={{width:'100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-6.png')}
      >
        <View style={styles.container}>
          <ScrollView>
            
            <Image 
              source={require('@/img/yiuon_map.jpg')}
              style={{width:'100%',height:Dimensions.get('window').width/1024*582}}
              resizeMode="contain"
            />

            <View style={styles.sectionMid}>
              <View style={styles.line}>
                <Text style={styles.content} >沙田馬鞍山耀安邨耀頌樓地下</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.title} >星期一至五   </Text>
                <Text style={styles.content} >上午八時三十分至下午五時</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.title} >星期六   </Text>
                <Text style={styles.content} >上午八時三十分至下午二時</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.title} >星期日及公眾假期   </Text>
                <Text style={styles.content} >       休息</Text>
              </View>
            </View>

            <View style={styles.sectionBottom}>
              <View style={styles.line}>
                <Image 
                      source={require('@/img/contact_phone.png')}
                      style={styles.icon}
                      resizeMode="contain"
                />
                <Text style={styles.title} >電話     : </Text>
                <Text style={styles.content} >2641-7787</Text>
              </View>
              <View style={styles.line}>
                <Image 
                      source={require('@/img/contact_fax.png')}
                      style={styles.icon}
                      resizeMode="contain"
                />
                <Text style={styles.title} >傳真     : </Text>
                <Text style={styles.content} >2641-4634</Text>
              </View>
              <View style={styles.line}>
                <Image 
                      source={require('@/img/contact_mail.png')}
                      style={styles.icon}
                      resizeMode="contain"
                />
                <Text style={styles.title} >電郵     : </Text>
                <Text style={styles.content} >info@yiuonec.org.hk</Text>
              </View>
              <View style={styles.line}>
                <Image 
                      source={require('@/img/contact_web.png')}
                      style={styles.icon}
                      resizeMode="contain"
                />
                <Text style={styles.title} >網址     : </Text>
                <Text style={styles.content} >www.yiuonec.org.hk</Text>
              </View>
            </View>

          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  sectionMid: {
    paddingVertical: 18,
    paddingHorizontal: 17,
    backgroundColor: 'white',
    // marginVertical: 8,
    // marginHorizontal: 16,
  },
  sectionBottom: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginTop: 12,
  },
  line: {
    flex:0,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  title: {
    fontSize: 18,
    color: '#994278',
  },
  content: {
    fontSize: 17,
    color: '#5f5f5f',
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
});
