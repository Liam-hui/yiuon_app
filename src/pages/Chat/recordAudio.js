import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  PanResponder,
  View,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export default class Record extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.state = {
      outed: false,
      send: true,
      haveRecordingPermissions: false,
      isLoading: false,
      recordingDuration: null,
      isRecording: false,
    };
    this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
  }

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: ()=> true,
    onPanResponderGrant: ()=>{
        this.setState({
            send: true,
            outed: false,
        });
        // console.log("start");
        this._onRecordPressed();
    },
    onPanResponderRelease: (evt,gs)=>{
        if(this.state.send) {
            // console.log("end");
            this._onRecordPressed();
        }
    },
    onPanResponderMove: (evt,gs)=>{
        const dist = 50;
        if(Math.abs(gs.dx)>dist||Math.abs(gs.dy)>dist) {
            this.setState({
                send: false,
            });
            // if(!this.state.outed) console.log("out");
            if(!this.state.outed) this._onRecordPressed();
            this.setState({
                outed: true,
            });
        }
    },
  })

  componentDidMount() {
    this._askForPermissions();
  }

  async BeginRecording() {
    this.setState({
      isLoading: true,
    });
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  async StopRecording() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    if(this.state.send && this.recording._finalDurationMillis>1000) { 
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      this.props.onRecordEnd(info.uri);
      console.log("in",`FILE INFO: ${JSON.stringify(info)}`);
    }
    
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this.StopRecording();
    } else {
      this.BeginRecording();
    }
  };

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted',
    });
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getRecordingTimestamp() {
    if (this.state.isRecording && this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  render() {
    let {show, onRecordEnd} = this.props;

    if(show) return (
      <View style={styles.audioContainer}>
        <Text style={{fontSize:20, color: '#994278',marginBottom:5,opacity: this.state.isRecording ? 1.0 : 0.0 }}>
            {this._getRecordingTimestamp()}
         </Text>


        <View {...this.panResponder.panHandlers} >
          <Image
              source={this.state.isRecording ? require('@/img/audio_record-2.png') : require('@/img/audio_record-1.png')}
              style={{ width:85, height:85,}}
              resizeMode="contain"
          />
        </View>

        <Text style={{fontSize:20, color: 'black',marginTop:10, opacity: this.state.isRecording ? 1.0 : 0.0 }}>
           移開手指以取消錄音
         </Text>
      </View>
    )
    else return null;
  }
}

Record.defaultProps = {
    show: false,
    onRecordEnd: () => {},
  };

const styles = StyleSheet.create({
  audioContainer:{
      flex:0,
      alignItems:'center',
      padding: 15,
      width:'100%',
      height:180,
      backgroundColor: 'white',
  },
  rect:{
      position:'absolute',
      width:100,
      height:100,
      backgroundColor:'red',
  }
});