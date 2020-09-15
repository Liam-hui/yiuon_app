import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { StyledContainer, StyledTitle } from './styles';

const { width, height } = Dimensions.get('screen');

export default function FormInput({ labelName,addStyle, ...rest }) {
  return (
    <TextInput
      label={labelName}
      style={[styles.input, addStyle]}
      numberOfLines={1}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    width: '100%',
    height: height / 17
  }
});