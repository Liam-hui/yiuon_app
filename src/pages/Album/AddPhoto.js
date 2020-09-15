import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, SafeAreaView,ScrollView,Dimensions,FlatList} from 'react-native';
import { Title} from 'react-native-paper';
import FormInput from '@/components/FormInput';
import FormButton from '@/components/FormButton';
import {PickImage} from '@/components/PickImage';
import DatePicker from '@/components/Datepicker';
import { Services } from '@/services/';
import PopOutOptionFull from '@/components/PopOutOptionFull';
import{useSelector,useDispatch} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ImageManipulator } from 'expo-image-crop'
import moment from 'moment';

export default function AddPhotoScreen({route,navigation}) {
    const [cover, setCover] = useState(null);
    const [photos, setPhotos] = useState([]);  
    const [name, setName] = useState('');
    const [date, setDate] = useState( new Date() );
    const [datePicker, setDatePicker] = useState(null);
    const [warning, setWarning] = useState(' ');

    const [submitPop, setSubmitPop] = useState(false);
    const [optionCover, setOptionCover] = useState(true);
    const [showPickImage, setShowPickImage] = useState(false);

    const {item,newAlbum} = route.params;

    const member_type = useSelector(state => state.auth_state.userType);

    useFocusEffect(
      React.useCallback(() => {
        if (!newAlbum) {
          setName(item.title);
          setDate(item.date_for_display);
        }
        else setDate( moment().format('DD/MM/YYYY') );
  
        return () => {};
      }, [])
    );

    useEffect(() => {
      navigation.setParams({
        pop: navigation.goBack,
      });

    }, []);
    
    const addPhoto = (uri) => {
      if(optionCover)setCover(uri);
      else setPhotos(photos.concat(uri));
    }

    const handle_submit = () => {
      if(cover||photos.length>0){
        if(name=='') {setWarning('請輸入相簿名稱')}
          else if(newAlbum){
            Services.create_album(name,date,upload_photos);
          }
            else upload_photos(item.id);
      }
      else {setWarning('請上傳相片')}
    }

    const upload_photos = (id) => {
      if(cover) Services.upload_image_to_album(id,cover,(photo_id) => Services.set_album_cover(id,photo_id));

      for(let i=0;i<photos.length;i++){
        Services.upload_image_to_album(id,photos[i]);
      }

      navigation.goBack();
    }
  
    const CoverPhoto = () => {
      if(cover) return(
        <Image 
          source={{ uri: cover }}
          style={{width:'100%', height:200}}
          resizeMode="contain"
        /> 
      );
      else return null;
    }

    const renderPhotos = (item) => {
      return (
        <View style={styles.smallPhoto}>
          <Image 
              source={{ uri: item.item}}
              style={{width:'100%', height:'100%'}}
              resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              console.log(item.index);
              setPhotos(photos.filter((x,i) => i != item.index));
            }}
          >
            <View style={styles.closeButton}>
              <Image 
                source={require('@/img/del_photo.png')}
                style={{width:'100%', height:'100%'}}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        </View>
      );
    };

  return (
    <SafeAreaView>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-1.png')}
      > 
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.top}>

              <Title style={styles.inputText}>相簿名稱</Title>
              <FormInput
                value={name}
                editable={newAlbum}
                onChangeText={name => {setName(name);setWarning(' ')}}
              />
              <Title style={styles.inputText}>活動日期</Title>
              <TouchableOpacity
                disabled={!newAlbum}
                onPress={()=> {
                  datePicker.onPressDate();
                }}
              >
                <FormInput
                  pointerEvents='none'
                  value={date}
                  editable={false}
                />
              </TouchableOpacity>
              <DatePicker
                ref={(ref) => {
                  setDatePicker(ref);
                }}
                style={{width: 0, height:0}}
                showIcon={false}
                hideText={true}
                confirmBtnText='Enter'
                cancelBtnText='Cancel'
                mode="date"
                format="DD/MM/YYYY"
                minDate="01/01/2000"
                maxDate="31/12/2050"
                onDateChange={(date) => {setDate(date)}}
                customStyles={{
                  btnTextCancel: {
                    color: 'black'
                  },
                  btnTextConfirm: {
                    color: 'black'
                  }
                }}
              />

              {member_type=='staff'? ( 
                <>
                <Title style={styles.inputText}>相簿封面</Title>
                <FormButton
                  title='＋上傳相片'
                  addStyle={{marginTop:5,marginBottom:10}}
                  labelStyle={{fontSize: 20}}
                  onPress = {() => {
                    setWarning(' ');
                    setOptionCover(true);
                    setSubmitPop(true);
                  }}
                />
                </>
                ):(null)
              }
              
              <CoverPhoto/>
            
              <Title style={styles.inputText}>活動相片</Title>
              <FormButton
                title='＋上傳相片'
                addStyle={{marginTop:5,marginBottom:10}}
                labelStyle={{fontSize: 20}} 
                onPress = {() => {
                  setWarning(' ')
                  setOptionCover(false);
                  setSubmitPop(true);
                }}      
              />  
                <FlatList
                  data={photos}
                  style={{marginTop: 10}}
                  renderItem={renderPhotos}
                  keyExtractor={(item) => item.id}
                  numColumns='2'
                  extraData={photos}
                  columnWrapperStyle={{flex:0,justifyContent: 'space-between',marginBottom:15}}
                />
            </View>

            <View style={{width: '80%',marginTop:'auto'}}>
              <Text style={styles.warn}>{warning}</Text>
                <FormButton
                  title='提交'
                  addStyle={{marginTop:8,marginBottom:40}}
                  labelStyle={{fontSize: 20}}
                  onPress={()=>handle_submit()}
                />  
            </View> 
          </View>

        </ScrollView>        

        {submitPop? (
          <PopOutOptionFull
            text={'圖片提交後會經職員審批才能在相簿內刊登,若經職員發現不適當的內容,圖片有機會被刪除。'}
            butTextTop={'確定'}
            butTextBot={'返回'}
            butFuncTop={()=>{setShowPickImage(true);}}
            butFuncBot={()=>setSubmitPop(false)}
          />
          ):(null)
        }

        {showPickImage? (
          <>
          <PickImage
            addPhoto={addPhoto}
            hidePop={()=>setSubmitPop(false)}
            turnOff={()=>{ setShowPickImage(false); setSubmitPop(false);} }
          />
          </>
         ):(null)
        }

      </ImageBackground>
    </SafeAreaView>
  );
}

const screenWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40,
    // justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 18
  },
  top:{
    marginTop:30,
    width: '80%',
  },
  smallPhoto:{
    width:screenWidth*0.38,
    height:screenWidth*0.38,
  },
  closeButton:{
    backgroundColor: '#97407f',
    width:40,
    height:40,
    position: 'absolute',
    right: 0,
  },
  inputText: {
    color: '#A24982',
    fontSize: 20,
    marginBottom: 2
  },
  warn: {
    height: 16,
    fontSize: 14,
  },
  bottomButtonWrapper: {
    // backgroundColor: 'red',
    marginTop: 10,
    width: '90%',
    height: 110
  },
  bottomButton: {
    height: '100%', 
    width: '47%',
    position: 'absolute',
    top: 0
    // right: 0
  }

});