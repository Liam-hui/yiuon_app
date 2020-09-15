import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions,Modal,SafeAreaView  } from 'react-native';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';

export default function PopOutOptionFull({text,butTextTop,butTextBot,butFuncTop,butFuncBot}) {

    return (
        <Modal
            animationType='fade'
            transparent={true}
            visible={true}
        >
            <SafeAreaView style={{ width:'100%', height:'100%'}}>

                <View  style={styles.container}>
                    <View style={styles.box}>
                        <Text style={styles.text}>{text}</Text>
                        <FormButton
                        title={butTextTop}
                        addStyle={{marginTop:50}}
                        labelStyle={{fontSize: 20}}
                        onPress={() => {
                            if(butFuncTop)butFuncTop();
                        }}
                        />
                        {butTextBot?(
                            <FormButton
                            title={butTextBot}
                            addStyle={{marginTop:20}}
                            labelStyle={{fontSize: 20}}
                            onPress={() => {
                                if(butFuncBot)butFuncBot();
                            }}
                            />
                        ):(null)}    
                    </View>
                </View>

            </SafeAreaView>
        </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
        height:'100%',
        width: '100%',
        backgroundColor: 'rgba(64,40,61,0.9)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        // backgroundColor: 'white',
        width: '86%',
        height: 300,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    }
  });

//   const openStyle = [styles.open, {
//     left:   openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
//     top:    openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y + STATUS_BAR_OFFSET, target.y + STATUS_BAR_OFFSET]}),
//     width:  openVal.interpolate({inputRange: [0, 1], outputRange: [origin.width, WINDOW_WIDTH]}),
//     height: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.height, WINDOW_HEIGHT]}),
// }];
