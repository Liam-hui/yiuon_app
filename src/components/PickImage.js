import React, { useState, useEffect } from 'react';
import { View,Modal,Text} from 'react-native';
import { SafeAreaView } from 'react-navigation';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator } from 'expo-image-crop'


const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

export const PickImage = ({mode,addPhoto,hidePop,turnOff}) => {
  const [imageUrl, setImageUrl] = useState('');

  const Picker = async () => {
    let type = ImagePicker.MediaTypeOptions.Images;
    if (mode=='video') type = ImagePicker.MediaTypeOptions.Videos,
    getPermissionAsync();
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
        });
        if (!result.cancelled) {
          if(hidePop) hidePop();
          setImageUrl(result.uri);
        }
        else {
          // console.log('cancel');
          turnOff();
          if(hidePop) hidePop();
        }

        console.log(result);
    } catch (E) {
        console.log(E);
    }
};
    useEffect(() => {
      Picker();
    }, []);

    return(
      <>
        {imageUrl!=''? (
          <ImageManipulator
            photo={{"uri": imageUrl }}
            isVisible={true}
            onPictureChoosed={({ uri: uriM }) => addPhoto(uriM)}
            onToggleModal={turnOff}
          />
          ):(null)
        }
      </>
    );
};
