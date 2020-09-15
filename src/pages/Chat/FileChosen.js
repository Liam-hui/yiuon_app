import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions,TouchableOpacity,Image  } from 'react-native';
import {Video} from 'expo-av';
import { Entypo } from '@expo/vector-icons'; 


export default function FileChosen({imageUrl,videoUrl}) {
    const [videoHeight, setVideoHeight] = useState(0);
    const [videoWidth, setVideoWidth] = useState(0);

    // setVideoWidth(12);
    console.log(videoUrl);

    const setVideoSize = (data) => {
        let w=data.naturalSize.width;
        let h=data.naturalSize.height;
        let ratio = w/h;
        let max_width = Dimensions.get('window').width;
        let max_height = Dimensions.get('window').height*0.6;
        if(w>h) {
            h = max_width/ratio;
            w = max_width;
        }
        else{
            w = max_height*ratio;
            h = max_height;
        }
        setVideoWidth(w);
        setVideoHeight(h);

        setVideoWidth(30);
        console.log(videoWidth);
        // console.log(data,w,h,videoHeight,videoWidth);
    }

    return(
        <View style={styles.fileChosen}>
            {imageUrl!=''?(
                <>
                    <TouchableOpacity 
                        style={{marginLeft:'auto',marginRight:25,marginBottom:10,flexDirection:'row',alignItems: 'center'}}
                        onPress={()=>{setShowCropImage(true)}}
                    >
                        <>
                        <Text style={{fontSize:15,color:'white',marginRight:5}}>編輯相片</Text>
                        <Entypo name="edit" size={15} color="white" />
                        </>
                    </TouchableOpacity>
                    <Image
                        source={{uri:imageUrl}}
                        style={{ width:'100%', height:'60%'}}
                        resizeMode="contain"
                    />
                </>
            ):(null)}
            {videoUrl!=''?(
                // <View style={{height:'60%'}}>
                    <Video
                        source={{ uri: videoUrl }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        shouldPlay={false}
                        useNativeControls={true}
                        onReadyForDisplay={data => setVideoSize(data)}
                        style={{ width:'100%', height:'60%'}}
                        // style={{ width:videoWidth, height:videoHeight}}
                        resizeMode="contain"
                    />
                // </View>
            ):(null)}
        </View>
    )
}

const styles = StyleSheet.create({
    fileChosen:{
        height:'100%',
        // marginLeft:'auto',
        // marginRight:'auto', 
        // height:Dimensions.get('window').height-inputBarHeight-50, 
        // width:Dimensions.get('window').width, 
        backgroundColor:'black',
        justifyContent: 'center',
        alignItems:'center',
    },
});