import React, {useState, useEffect } from 'react';
import { Text, View, StyleSheet,ImageBackground,TouchableOpacity,TouchableHighlight,Image,Slider} from 'react-native';
import { GiftedChat,Bubble,Send,Composer,InputToolbar} from 'react-native-gifted-chat';
import { PickImage } from '@/components/PickImage';
import { Avatar,IconButton } from 'react-native-paper';
import Gallery from 'react-native-image-gallery';
import Record from '@/pages/Chat/recordAudio'
import MessageAudio from '@/pages/Chat/messageAudio';
import MessageVideo from '@/pages/Chat/messageVideo';
import MessageImage from '@/pages/Chat/messageImage';
import { useFocusEffect } from '@react-navigation/native';
import { Services } from '@/services/';
import { chatDatabase } from '@/services/ChatDatabase';
import{useSelector,useDispatch} from 'react-redux';

export default function Chatroom({navigation,route}) {
    const userData = useSelector(state => state.auth_state.userData);

    const {group,other} = route.params;
    let group_pic, group_title;
    

    const [messages, setMessages] = useState([]);
    const [end, setEnd] = useState(false);
    const [text, setText] = useState('');

    //show extra component
    const [showUpload, setShowUpload] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [showimagesChosen, setShowimagesChosen] = useState(false);

    const [imagesChosen, setImagesChosen] = useState([]);
    const [imageUrl, setImageUrl] = useState([]);

    const [audioUrl, setAudioUrl] = useState('');

    const [onSend, setOnSend] = useState(null);

    const [contentHeight, setContentHeight] = useState(1);
    const [layoutHeight, setLayoutHeight] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            if(group.isPrivate==1) {
                group_pic = group.users[other].pic;
                group_title = group.users[other].name;
            }
            else{
                group_pic = group.pic;
                group_title = group.title;
            }

            navigation.setParams({
                title:group_title,
                right: renderHeaderRight,
            });
            loadChats();
        return () => {};
    }, [])
    );


    const data_to_messages = (data) => {
        // console.log(data);
        // for(let i=0;i<data.length;i++){
        //     let user = {};
        //     let user_data = data[i].userData.split(' , ');
        //     user._id = user_data[0];
        //     user.name = user_data[1];
        //     user.pic = user_data[2];
        //     delete msg.userData;
        //     msg.user = user;
        // }
        return data;
    }

    async function loadChats() {
        try {
            await chatDatabase.setupDatabaseAsync()
            await chatDatabase.getMessages((data)=> setMessages(data_to_messages(data)))

            
            Services.get_new_messages(group.id,'');
        //   if(messages.length==0)
        //   await chatDatabase.insertMessages(payload.data)
  
        } catch (e) {
          console.warn(e);
        }
    }

    // const get_new_messages = (lastId) => {
    //     while(){
    //         Services.get('chat/getMessages?conversationID='+group.id+'&lastID='+lastId,
    //             (payload)=> {
    //                 setMessages(payload.data)
    //                 if(payload.next!=null) get_new_messages();
    //                 else resolve("Stuff worked!");
    //             }
    //         );
    //     }
    // }

    // useEffect(() => {
    //     if( !end && (contentHeight<=layoutHeight) ) update_old_messages();

    //     // let messages_ = messages;
    //     // let currentUserId = -1;
    //     // for(let i=messages_.length-1;i>=0;i--){
    //     //     if(messages_[i].user._id != currentUserId) messages_[i].is_first = true; else messages_[i].is_first = false;
    //     //     currentUserId = messages_[i].user._id;
    //     // }
    //     // setMessages(messages_);

    // }, [messages]) 

    const reset_messages = () => {
        setEnd(false);
        // Services.get('chat/getMessages?conversationID='+group.id,reset_messages_action);
        Services.get('chat/getMessages?conversationID='+group.id,loadChats);
    }

    const reset_messages_action = (payload) => {
        setMessages(data_to_messages(payload.data));
    }

    // const update_old_messages = () => { 
    //     Services.get('chat/getMessages?conversationID='+group.id+'&before=y&lastID='+messages[messages.length-1]._id,update_old_messages_action);
    // };

    // const update_old_messages_action = (payload) => {
    //     setMessages(messages.concat(data_to_messages(payload.data)));
    // }

    // const data_to_messages = (data) => {
    //     if(data.length==0) setEnd(true);
    //     let new_messages = [];
    //     for(let i=0;i<data.length;i++){
    //         let new_msg = {user:{}};
    //         new_msg._id = data[i].message_id;
    //         new_msg.text = data[i].body;
    //         new_msg.type = data[i].type;
    //         switch (data[i].type) {
    //             case 'image': {
    //                 new_msg.image = data[i].attachment;
    //             }
    //             break;
    //             case 'video': {
    //                 new_msg.video = data[i].attachment;
    //             }
    //             break;
    //             case 'audio': {
    //                 new_msg.audio = data[i].attachment;
    //             }
    //             break;
    //          }
    //         new_msg.is_sender = data[i].is_sender;
    //         new_msg.user.name = data[i].sender.name;
    //         new_msg.user._id = data[i].sender.id;
    //         new_msg.user.pic = data[i].sender.pic;
    //         new_messages.push(new_msg);
    //     }
    //     return new_messages;
    // }

    const renderHeaderRight = () => (
        <TouchableOpacity
            onPress={() => {navigation.navigate('admin-setting')} }
        >
            <Avatar.Image size={40} source={{ uri: group_pic }} style={{marginRight:10}} />
      </TouchableOpacity>
    )

    const Upload = (props) => {
        if(showUpload){
            return (
                <View style={styles.upload}>

                {/* upload video */}
                <TouchableHighlight 
                    onPress={() => {
                        PickImage(null,(() => setShowimagesChosen(false)),'video');
                        if (text=='') setText(' ');
                    }
                }>
                    <View style={styles.uploadItem} >
                        <Image
                            source={require('@/img/icon_share_video.png')}
                            style={{ width:35, height:35, marginRight:10}}
                            resizeMode="contain"
                        />
                        <Text style={styles.uploadText}>上傳影片</Text>
                    </View>
                </TouchableHighlight>

                <View style={{paddingHorizontal:30,backgroundColor:'white'}}>
                    <View style={styles.uploadLine}></View>
                </View>

                {/* upload photo */}
                <TouchableHighlight 
                    onPress={() => {
                        PickImage(addImagesChosen,(() => setShowimagesChosen(false)),'photo');
                        if (text=='') setText(' ');
                    }
                }>
                    <View style={styles.uploadItem}>
                        <Image
                            source={require('@/img/icon_share_photo.png')}
                            style={{ width:35, height:35, marginRight:10}}
                            resizeMode="contain"
                        />
                        <Text style={styles.uploadText}>上傳相片</Text>
                    </View>

                {/* cancel */}
                </TouchableHighlight>
                    <TouchableHighlight onPress={() => {setShowUpload(false)}}>
                        <View style={[styles.uploadItem,{marginTop:8}]}>
                            <Text style={styles.uploadText}>取消</Text>
                        </View>
                    </TouchableHighlight>
                    
                </View>
            );
        }
        else return null;
    }

    const addImagesChosen = (newPhotourl) => {
        setShowUpload(false);
        setShowimagesChosen(true);
        let newPhoto = { source: { uri: newPhotourl } };
        setImageUrl(imageUrl.concat(newPhoto));
        setImagesChosen(imagesChosen.concat(newPhotourl));
        console.log(imageUrl);
    }

    const renderImageChosen= () => {
    // if(imagesChosen.length>0) 
       return(
            <View >
                <Gallery
                    style={{ flex: 1, backgroundColor: 'black' }}
                    images={imageUrl}
                />
            </View>
        )
    }

    const imageSendText = (text) => {
        if(showimagesChosen && text=='') setText(' ');
        else setText(text);
    }
    
    const renderBubble = (props) => { 
        let bubbleWrapperStyle = styles.bubbleWrapperLeft;
        let bubbleStyle = styles.bubbleLeft;
        if (props.currentMessage.is_sender) {
            bubbleWrapperStyle = styles.bubbleWrapperRight;
            bubbleStyle = styles.bubbleRight;
        }
        // if (props.currentMessage.user._id==userData.id) bubbleStyle = styles.bubbleRight;
        return (
            <View style={[styles.bubbleWrapper,bubbleWrapperStyle]}>
                {props.currentMessage.is_first? (
                    <View style={styles.bubbleUser}>
                        <Avatar.Image size={40} source={{uri:props.currentMessage.user.pic}}/>
                        <Text style={{fontSize:20,marginLeft:10}}>{props.currentMessage.user.name}</Text>
                    </View>
                    ):(null)
                }
                <View style={[styles.bubble,bubbleStyle]}>
                    {props.currentMessage.type=='image' ? (<MessageImage {...props} />):(null)} 
                    {props.currentMessage.type=='audio' ? (<MessageAudio {...props} />):(null)} 
                    {props.currentMessage.text!='' ? (<Text style={styles.bubbleText}>{props.currentMessage.text}</Text>):(null)} 
                </View>
            </View>
        );
    }

    const renderSend = (props) => {

        const SendContent = () => {
            if ((props.text && props.text.trim().length > 0)||showimagesChosen) {
                return (
                    <Text style={{fontSize:18, color:'#993f7e'}}>發送</Text>
                );
            }
            else return (
                <TouchableOpacity 
                    onPress={() => {
                        setShowAudio(!showAudio)
                        if(onSend==null) setOnSend(() => () => props.onSend(''));
                    }}                
                >
                    <Image
                        source={require('@/img/icon_audio.png')}
                        style={{ width:30, height:30, margin:5}}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            );
        }
    return (
        <Send
            {...props}
            text={text}
            containerStyle={styles.send}
            alwaysShowSend={true}
            children={
                <View>
                <SendContent
                    // {...props}
                />
                </View>
            }
        > 
        </Send>
    );
    }

    const renderActions = (props) => {
        let upload_button;
        if (!showimagesChosen) upload_button = 
            <TouchableOpacity onPress={() => {setShowUpload(true)}}>
            <Image
                source={require('@/img/icon_upload.png')}
                style={{ width:30, height:30, margin:5}}
                resizeMode="contain"
            />
            </TouchableOpacity>
        
        else upload_button =  null;

        return (
        <View style={styles.actions}>
            {upload_button}
            <TouchableOpacity
            onPress={() => {console.log(messages);}}
                
            >
            <Image
                source={require('@/img/icon_emoji.png')}
                style={{ width:30, height:30, margin:5}}
            />
            </TouchableOpacity>
        </View>
        );
    }

    const renderComposer = (props) => {
        return (

        <Composer 
            {...props} 
            placeholder={'請輸入訊息...'} 
            placeholderColor={'#BCBCBC'} 
            textInputStyle={styles.textInput}
            
        />
        );
    }

    const renderInputToolbar = (props) => {
        return (
            <InputToolbar {...props} 
            primaryStyle={[styles.InputToolbar]}
            // onSend={props}
            />
        
        );
    }

    const renderMessageVideo = (props) => {
        // console.log(props);
        return (
            <MessageVideo
            {...props}
            />
        )
    }

    function handleSend(newMessage = []) {
        setShowimagesChosen(false);
        if(imagesChosen.length>0) {
            Services.send_msg(group.id,'image',newMessage[0].text,reset_messages,imagesChosen[0]);
            setImageUrl([]);
            setImagesChosen([]);
        }
        else if(audioUrl){
            Services.send_msg(group.id,'audio','',reset_messages,audioUrl);
            setAudioUrl('');
        }
        else Services.send_msg(group.id,'text',newMessage[0].text,reset_messages);
        // setMessages(GiftedChat.append(messages, newMessage));
    }

    return (
    <ImageBackground
        style={{width: '100%', height: '100%'}}
        resizeMode='cover' 
        source={require('@/img/background-7.png')}
    >
        <GiftedChat
            listViewProps={{
                scrollEventThrottle: 400,
                onScroll: ({ nativeEvent }) => {
                    // console.log(nativeEvent);
                    // handleScroll(nativeEvent);
                },
                onLayout: ({nativeEvent}) => {
                    setLayoutHeight(nativeEvent.layout.height);
                },
                onContentSizeChange: (w,h) => {
                    setContentHeight(h);
                },
                // onEndReached: (e) => {
                //     update_old_messages();
                // },
            }
        }
        // ref={(ref) => setChatRef(ref)}
        messages={messages}
        onSend={newMessage => handleSend(newMessage)}
        user={{ _id: 1 }}
        renderAvatar={null}
        renderTime={() => void 0}
        renderMessage={showimagesChosen? renderImageChosen:null}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderComposer={renderComposer}
        renderSend={renderSend}
        // renderMessageAudio={renderMessageAudio}
        renderMessageVideo={renderMessageVideo}
        // renderMessageImage={renderMessageImage}
        minInputToolbarHeight={55}
        onInputTextChanged={imageSendText}
        />
        <Upload/>
        <Record
            onRecordEnd = {(a) => {
                setAudioUrl(a);
                setShowAudio(false);
                onSend('');
            }}
            show={showAudio}
        />
    </ImageBackground>
    );
}


const styles = StyleSheet.create({
  InputToolbar: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    // justifyContent: 'flex-end'
    minHeight:55,
    backgroundColor: '#eeeeee',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 1.65,
  },
  actions:{
    // backgroundColor: 'green',
    height:55,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex:1,
    minHeight: 40,
    backgroundColor: 'white',
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 0.5,
  },
  send: {
    // backgroundColor: 'green',
    width: 50,
    height:55,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upload:{
    position:'absolute',
    width: '100%',
    bottom:0,
    // flex:0,
    // justifyContent: 'flex-end',
  },
  uploadItem:{
    flex:0,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    height:56,
    backgroundColor: 'white',
  },
  uploadText:{
    fontSize: 22,
    color: '#994278',
  },
  uploadLine:{
    // width:'80%',
    height:1,
    backgroundColor: '#994278',
  },
  imageFull:{
    width:'100%',
    height:'100%',
    backgroundColor:'black',
  },
  bubbleWrapper:{
    flex:0,
  },
  bubble:{
    borderRadius: 10,
    maxWidth: 180,
    flex:0,
    alignItems:'center',
    justifyContent:'center',
    paddingVertical:10,
    paddingHorizontal:10,
    marginVertical:6,
  },
  bubbleUser:{
    height:50,
    flex:0,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:6,
  },
  bubbleText:{
      fontSize:20,
  },
  bubbleWrapperLeft:{
    marginRight:'auto',
    marginLeft:8,
    alignItems:'flex-start',
  },
  bubbleWrapperRight:{
    marginLeft:'auto',
    marginRight:15,
    alignItems:'flex-end',
  },
  bubbleLeft:{
    backgroundColor:'rgb(219,180,211)',
  },
  bubbleRight:{
    backgroundColor:'rgb(203,203,203)',
  },
});