import React from 'react';
import { View,StyleSheet, Dimensions, Text,TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('screen');

export default function FormButton({ title, addStyle, labelStyle, onPress}) {
  return (
    <TouchableOpacity style={[styles.buttonContainer, addStyle]} onPress={onPress}>
      <LinearGradient style={styles.content} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.0, 0.5, 0.5001, 0.99]}
        colors={['#a04b97', '#a04b97','#973e7f','#973e7f']}
      />
      <View style={styles.labelWrapper}>
        <Text style={[styles.label,labelStyle]}>{title}</Text>
      </View>
   </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: height / 17,
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden',
    borderRadius:8,
  },
  content:{
    width:width,
    height:height,
    transform: [{rotate:'10deg'}],
    justifyContent:'center',
    alignItems:'center',
  },
  labelWrapper:{
    position:'absolute',
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  label:{
    color:'white',
    fontWeight:'500'
  }
});