import React, {useState, useEffect } from 'react';
import { Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import MediaFull from '@/components/MediaFull';
const max_height = 120;
const max_width = 150;
const styles = StyleSheet.create({
    image: {
        margin: 3,
        resizeMode: 'contain'
    },

});

export default function MessageImage(props){
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [full, setFull] = useState(false);
    
    const {currentMessage} = props;

    Image.getSize(currentMessage.image, (w, h) => { 
        let ratio = w/h;
        if(w>h) {
            h = max_width/ratio;
            w = max_width;
        }
        else{
            w = max_height*ratio;
            h = max_height;
        }
        setWidth(w);
        setHeight(h);
    });

    if (!!currentMessage) {
        return (
            <>
            {full?(
                <MediaFull
                    content={(
                        <Image style={[styles.image,{ width:'100%', height:'100%'}]} source={{ uri: currentMessage.image }}/>
                    )}
                    close={()=>setFull(false)}
                    uri={currentMessage.image}
                    type={'image'}
                />
            ):(
                <TouchableOpacity onPress={()=>setFull(true)}>
                    <Image style={[styles.image,{ width:width, height:height}]} source={{ uri: currentMessage.image }}/>
                </TouchableOpacity>

            )}
            </>
        );
    }
    return null;

}
