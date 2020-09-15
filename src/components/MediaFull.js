import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Modal,TouchableOpacity,Image  } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import PopOutOption from '@/components/PopOutOption';
// import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
import moment from 'moment';

function random_name() {
    // return 'moment().format('YYYYMMDD_HHmmss');
    return '_' + Math.random().toString(36).substr(2, 7);
}

export default function MediaFull({content,close,uri,type}) {

    const [pop, setPop] = useState(false);

    // const ext = uri.split('.').pop();
    // const type = mime.lookup(ext); 

    let ext = '.png';
    if(type=='video') ext = '.mov';
    console.log(ext);

    useFocusEffect(
        React.useCallback(() => {
            MediaLibrary.requestPermissionsAsync();
            console.log(uri);

        return () => {};
        }, [])
    );
    
    const handle_download = async() =>{
        FileSystem.downloadAsync(
            uri,
            FileSystem.documentDirectory + Date.now() + random_name() 
            // FileSystem.documentDirectory + Date.now() + random_name() + ext
          )
            .then(({ uri }) => {
              console.log('Finished downloading to ', uri);
              MediaLibrary.saveToLibraryAsync(uri)
                .then(response=> {
                    setPop(true);
                })
                .catch(error =>{
                    alert(error);
                });
            })
            .catch(error => {
              console.error(error);
            });
    }

    return (
        <>
         {/* <SafeAreaView>  */}
        <Modal
            animationType='fade'
            transparent={true}
            visible={true}
        >
            <SafeAreaView style={{ width:'100%', height:'100%'}}>

                <View style={styles.container}>

                    {content}
                    <TouchableOpacity style={styles.closeButton} onPress={()=>close()}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.downloadButton} onPress={()=>handle_download()}>
                        <Image
                            source={require('@/img/download_btn.png')}
                            style={{ width:30, height:30, margin:5}}
                            resizeMode="contain"
                        />
                        <Text style={styles.downloadButtonText}>下載</Text>
                    </TouchableOpacity>

                </View>
                
            </SafeAreaView>
        </Modal>
        {/* </SafeAreaView>  */}

        {pop? (
            <PopOutOption
            text={'成功儲存！'}
            butTextTop={'確定'}
            butFuncTop={()=>setPop(false)}
            />
        ):(null)
        }

        </>
    );
  }
  
const styles = StyleSheet.create({
container: {
    height:'100%',
    width: '100%',
    backgroundColor: 'rgba(64,40,61,1)',
    justifyContent: 'center',
    alignItems: 'center'
},
popupWrapper:{
    position:'absolute',
    bottom:50,
    left:0,
    alignItems:'center',
    width:'100%',
    // borderRadius:15,
},
popup:{
    width:'60%',
    height:50,
    backgroundColor:'rgba(255,255,255,0.8)',
    borderRadius:25,
},
downloadButton: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    marginBottom:10,
    marginLeft:10,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
downloadButtonText: {
    fontSize: 25,
    color: 'white',
    lineHeight: 40,
    textAlign: 'center',
},
closeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop:10,
    marginLeft:15,
},
closeButtonText: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    textAlign: 'center',
},
});


