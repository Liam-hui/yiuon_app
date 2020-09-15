import React, {Component, useState} from 'react';
import { ImageBackground } from 'react-native';

export default function HomeScreen() {
	return (
		<ImageBackground
			style={{width: '100%', height: '100%'}}
			resizeMode='cover' 
			source={require('@/img/background-1.png')}
		>
		</ImageBackground>
	);
  }