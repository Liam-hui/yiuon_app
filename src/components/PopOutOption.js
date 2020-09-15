import React from 'react';
import { View, Text, StyleSheet, Dimensions,TouchableWithoutFeedback,Modal } from 'react-native';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import { Avatar} from 'react-native-paper';

export default function PopOutOption({close,text,butTextTop,butTextBot,butFuncTop,butFuncBot,avatar}) {

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={true}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>{if(close)close();}}><View style={styles.empty}></View></TouchableWithoutFeedback>
                <View style={styles.box}>
                    <View style={styles.row}>
                        {avatar? (
                            <Avatar.Image size={35} style={{backgroundColor:'rgba(0,0,0,0.1)',marginRight:10}} source={{uri:avatar}} />
                        ):(null)
                        }
                        <Text style={styles.text}>{text}</Text>
                    </View>
                    <FormButton
                    title={butTextTop}
                    addStyle={{marginTop:18}}
                    labelStyle={{fontSize: 20}}
                    onPress={() => {
                        if(butFuncTop)butFuncTop();
                    }}
                    />
                    {butTextBot?
                    (<FormButton
                        title={butTextBot}
                        addStyle={{marginTop:20}}
                        labelStyle={{fontSize: 20}}
                        onPress={() => {
                            if(butFuncBot)butFuncBot();
                        }}
                    />)
                    :(null)
                    }
                </View>
            </View>
        </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        position:'absolute',
        top:0,
        left:0,
        height:Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        backgroundColor: 'white',
        width: '86%',
        borderWidth: 1.5,
        borderColor: '#ad7e9f',
        borderRadius: 15,
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    text: {
        color: '#ad7e9f',
        fontSize: 23,
    },
    row: {
        flexDirection:'row',
        alignItems:'center'
    },
    empty:{
        position:'absolute',
        width:'100%',
        height:'100%',
        // backgroundColor:'black',
    }
  
  });