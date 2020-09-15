import React, { Component,  Children, cloneElement } from 'react';
import {View,StyleSheet,TouchableWithoutFeedback,Dimensions} from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    active: {
        // flex: 1,
        resizeMode: 'contain',
        backgroundColor: 'black',
        height: HEIGHT,
        width: WIDTH,
    },
});

export default class Overlay extends Component {
    
    content = () => {
        if(this.props.activeProps) {
          return cloneElement(
            Children.only(this.props.children),
            this.props.activeProps
          );
        }
        return this.props.children;
    }

    // const basic = (
    //     <TouchableWithoutFeedback
    //         // onPress={}
    //     >
    //         {props.children}
    //     </TouchableWithoutFeedback>
    // )
        
    render(){
        return (
            <View>
                {this.content()}
            </View>
        );
    }
    
}