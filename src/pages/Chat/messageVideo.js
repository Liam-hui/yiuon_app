import React, {useState, useEffect } from 'react';
import { Image, StyleSheet, Dimensions,View, TouchableOpacity} from 'react-native';
import MediaFull from '@/components/MediaFull';
import {Video} from 'expo-av';
const styles = StyleSheet.create({
    container: {
        margin: 0,
        alignItems:'center',
        justifyContent:'center',
    },
    empty: {
        position:'absolute',
        top:0,
        backgroundColor:'rgba(0,0,0,0.2)',
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent: 'center',
    }
});

export default function MessageVideo(props){
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [fullWidth, setFullWidth] = useState(1);
    const [fullHeight, setFullHeight] = useState(1);
    const [full, setFull] = useState(false);
    
    const {currentMessage} = props;

    const set_size = (data) => {
        let w=data.naturalSize.width;
        let h=data.naturalSize.height;
        let ratio = w/h;
        let max_width = 150;
        let max_height = 120;
        if(full){
            max_width=Dimensions.get('window').width;
            max_height=Dimensions.get('window').height;
        }
        if(w>h) {
            h = max_width/ratio;
            w = max_width;
        }
        else{
            w = max_height*ratio;
            h = max_height;
        }
        if(full){
            setFullWidth(w);
            setFullHeight(h);
        }
        else{
            setWidth(w);
            setHeight(h);
        }
    }

    if (!!currentMessage) {
        return (
            <>
            {full?(
                <MediaFull
                    uri={currentMessage.video}
                    type={'video'}
                    content={(
                        // <View style={{height:'100%',width:'100%'}}>
                            <Video
                                source={{ uri: currentMessage.video }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="contain"
                                shouldPlay={false}
                                onReadyForDisplay={data => set_size(data)}
                                useNativeControls={true}
                                style={{ width:fullWidth, height:fullHeight}}
                            />
                        // </View>
                    )}
                    close={()=>setFull(false)}
                />
            ):(
                <View style={[styles.container,{ width:width, height:height}]}>
                    <Video
                        source={{ uri: currentMessage.video }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="contain"
                        shouldPlay={false}
                        useNativeControls={false}
                        onReadyForDisplay={data => set_size(data)}
                        style={{ width:'100%', height:'100%'}}
                    />
                    <TouchableOpacity onPress={()=>setFull(true)} style={styles.empty}>
                        <Image
                            source={require('@/img/video-play.png')}
                            style={{ width:'100%', height:'60%'}}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            )}
            </>
        );
    }
    return null;

}