import React from 'react';
import { View, StyleSheet,TouchableOpacity,Image,Slider,Text} from 'react-native';
import { Audio} from 'expo-av';
import moment from 'moment';
import { Feather } from '@expo/vector-icons'; 

export default class MessageAudio extends React.Component {
  constructor(props) {
    super(props);
    this.sound = null;
    this.isSeeking = false;
    this.position = 0;
    this.state = {
      send: true,
      isLoading: false,
      isPlaybackAllowed: false,
      soundPosition: null,
      soundDuration: null,
      shouldPlay: false,
      isPlaying: false,
    };
  }
  

  async _loadAudio() {
    console.log(this.props.currentMessage.audio);
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        {uri: this.props.currentMessage.audio},
        // {uri: 'https://file-examples-com.github.io/uploads/2017/11/file_example_WAV_1MG.wav'},
        {shouldPlay: true},
        this._updateScreenForSoundStatus
      );
      this.sound = sound;
      // if(this.position!=0){
      //   const seekPosition = value * this.state.soundDuration;
      //   this.sound.setPositionAsync(seekPosition);
      // }
    } catch (error) {
      console.log(error)
    }

  }

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        isPlaying: status.isPlaying,
        isPlaybackAllowed: true,
        shouldPlay: status.shouldPlay,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onPlayPausePressed = () => {
    if(this.sound == null) this._loadAudio();
    else {
      // this.sound.playAsync();
        if (this.state.isPlaying) {
          this.sound.pauseAsync();
        } else {
          this.sound.playAsync();
        }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _onSeekSliderValueChange = value => {
    if(!this.isSeeking){
      this.isSeeking = true;
      if (this.sound != null) {
        this.sound.pauseAsync();
      }
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    this.isSeeking = false;
    this.position = value;
    if (this.sound != null) {
      const seekPosition = value * this.state.soundDuration;
      this.sound.setPositionAsync(seekPosition);
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

  componentDidMount() {
    // this._loadAudio();
  }

  render() {
    return(
        <View>
            <View style={styles.audioContainer}>
              <Image
                  source={require('@/img/voice_icon.png')}
                  style={{ width:25, height:28,marginLeft:0}}
                  resizeMode="contain"
              />
              <TouchableOpacity onPress={ () => {
                  this._onPlayPausePressed()
                }}
                style={styles.button}
              >
                  <Image
                    source={this.state.isPlaying ? require('@/img/pause_btn.png') : require('@/img/voice_play.png')}
                    style={{ width:15, height:18}}
                    resizeMode="contain"
                  />
              </TouchableOpacity>
              <View>
                <Slider
                  // trackImage={ICON_TRACK_1.module}
                  thumbImage={require('@/img/rect.png')}
                  style={styles.slider}
                  value={this._getSeekSliderPosition()}
                  onValueChange={this._onSeekSliderValueChange}
                  onSlidingComplete={this._onSeekSliderSlidingComplete}
                  disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
                />

                  <View style={styles.timeWrapper}>
                    {this.state.isPlaybackAllowed?(
                      <Text style={styles.time}>{this._getMMSSFromMillis(this.state.soundPosition)}</Text>
                    ):(null)}
                  </View>

              </View>
            </View>
            
        </View>
    );
   }
}

const styles = StyleSheet.create({
  audioContainer:{
    flexDirection:'row',
    alignItems: 'center',
  },
  button:{
    // backgroundColor:'green',
    height:40,
    width:25,
    alignItems:'center',
    justifyContent:'center',
  },
  slider:{
    width:110,
    // backgroundColor:'red',
  },
  timeWrapper:{
    flexDirection:'row',
    position:'absolute',
    bottom:0,
  },
  time:{
    // marginBottom: 2,
    marginRight:2,
    fontSize:10,
    color:'#444444',
  },
});