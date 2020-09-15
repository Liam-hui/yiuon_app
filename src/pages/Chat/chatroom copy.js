import React, {useState, useEffect,useRef } from 'react';
import { Text,Keyboard, View, StyleSheet,ImageBackground,TouchableOpacity,TouchableHighlight,TouchableWithoutFeedback,Image,Dimensions} from 'react-native';
import { GiftedChat,Send,Composer,InputToolbar,Message} from 'react-native-gifted-chat';
import { PickImage } from '@/components/PickImage';
import { Avatar } from 'react-native-paper';
import { Video } from 'expo-av';
import Record from '@/pages/Chat/recordAudio'
import MessageAudio from '@/pages/Chat/messageAudio';
import MessageVideo from '@/pages/Chat/messageVideo';
import MessageImage from '@/pages/Chat/messageImage';
import { Services } from '@/services/';
import { Chat} from '@/pages/Chat/handle_chat';
import { chatDatabase } from '@/services/ChatDatabase';
import{ useSelector,useDispatch } from 'react-redux';
import actions from '@/store/ducks/actions';
import store from '@/store';
import { MaterialIcons,Feather,Entypo } from '@expo/vector-icons'; 
import { ImageManipulator } from 'expo-image-crop'
import moment from 'moment';

export default function Chatroom({navigation,route}) {
    let {group,newRoom,loaded,loadRoom} = route.params;
    let other;

    const userData = useSelector(state => state.auth_state.userData);
    const newMessages = useSelector(state => state.newMessages);

    const [messages, setMessages] = useState([]);
    const [end, setEnd] = useState(false);
    const [initDone, setInitDone] = useState(false);
    const [onSend, setOnSend] = useState(null);
    const [text, setText] = useState('');

    const [showUpload, setShowUpload] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [showFileChosen, setShowFileChosen] = useState(false);
    const [showCropImage, setShowCropImage] = useState(false);

    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [audioUrl, setAudioUrl] = useState('');

    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    useEffect(() => {
        if(group.isPrivate==1) {
            other=0;
            if (group.users.length>1 && group.users[other].id == userData.id) other = 1;
            group.pic = group.users[other].pic;
            group.title = group.users[other].name;
        }
        if(group.title=='')group.title=' ';
        navigation.setParams({
            title:group.title,
            right: renderHeaderRight,
        });

        if(!loaded) {
            Services.get('chat/getMessages?conversationID='+group.id,
                (payload) => {
                    setMessages(dataToMessages(payload.data));
                    chatDatabase.deleteConversation(group.id);
                    chatDatabase.insertMessages(dataToMessages(payload.data),group.id);
                    loadRoom(group.id);
                },
                () => {
                    getMessagesFromStorage
                    loadRoom(group.id);
                }
            );
        }
        else {
            getMessagesFromStorage();
        }
    }, []) 

    const renderHeaderRight = () => (
        <TouchableOpacity
            onPress={() => {navigation.navigate('chat-setting', {group:group, title: group.title, other:other, onGoBack:(updated_group)=> {group = updated_group;}, changeTitle:(title)=>navigation.setParams({title:title}) 
        }) }}
        >
            <Avatar.Image size={40} style={{backgroundColor:'rgba(0,0,0,0.1)', marginRight:10}} source={{ uri: group.pic }} />
      </TouchableOpacity>
    )

    useEffect(() => {
        if(messages.length!=0 && !initDone) {
          if(!end && messages.length<20) updateOldMessages();
          else setInitDone(true);
        }

        if(group.isPrivate==0) {
            let messages_ = messages;
            let currentUserId = -1;
            for(let i=messages_.length-1;i>=0;i--){
                if(messages_[i].user._id != currentUserId) messages_[i].is_first = true; else messages_[i].is_first = false;
                currentUserId = messages_[i].user._id;
            }
            setMessages(messages_);
        }

    }, [messages]) 

    useEffect(() => {
        if(initDone||loaded) newMessages.forEach(newMsg=>{
            // alert(newMsg.text);
            if(newMsg=='system') alert('yes');
            else if(newMsg.sent) {
                messages.some(function(item, index){
                    if (item.uniqueId == newMsg.device_uniqid) {
                        if(!item.sent){
                            let messages_ = messages.slice();
                            messages_[index].sent = true;
                            messages_[index].fail = false;
                            setMessages(messages_);
                            chatDatabase.updateMessage('sent',item.uniqueId,1);
                            chatDatabase.updateMessage('fail',item.uniqueId,0);
                            if(newRoom) {
                                Services.get_rooms((data)=>{Chat.joinRooms(data)});
                                Chat.kickMember(group.users);
                                newRoom = false;
                            }
                        }
                        store.dispatch(actions.removeNewMsgAction(newMsg.id));
                        return true;
                    }
                });
            }
            else {
                if(newMsg.conversation_id==group.id) {
                    if(newMsg.sender.id!=userData.id) {
                        const new_ = messages.every(function(msg){
                            return msg.uniqueId != newMsg.device_uniqid;
                        });
                        if(new_){
                            setMessages(dataToMessages([newMsg]).concat(messagesRef.current));
                            chatDatabase.insertMessages(dataToMessages([newMsg]),group.id);
                        }
                    }
                    // store.dispatch(actions.removeNewMsgAction(newMsg.id));
                }
                store.dispatch(actions.removeNewMsgAction(newMsg.id));
            }
        });
        
    }, [newMessages]) 

    const getMessagesFromStorage = () => {
        if(!end) chatDatabase.getMessages(group.id,
            (data)=>{
                if(data.length>0) {
                    data.forEach(item=>{
                        if(!item.sent) item.fail=true;
                    })
                    setMessages(messages.concat(data));
                    updateNewMessages(data[0]._id);
                }
                // else setEnd(true);
            }
        );
    }

    const updateOldMessages = () => { 
        if(!end){
            let lastID = '';
            if(messages.length>0) lastID = messages[messages.length-1]._id;
            Services.get('chat/getMessages?conversationID='+group.id+'&before=y&lastID='+lastID,
                (payload) => {
                    setMessages(messages.concat(dataToMessages(payload.data)));
                    // setMessages(dataToMessages(payload.data).concat(messages));
                    chatDatabase.insertMessages(dataToMessages(payload.data),group.id);
                },
            );
        }
    };

    const updateNewMessages = (lastId) => { 
        Services.get('chat/getMessages?conversationID='+group.id+'&lastID='+lastID,
            (payload) => {
                setMessages(dataToMessages(payload.data).concat(messages));
                chatDatabase.insertMessages(dataToMessages(payload.data),group.id);
            },
        );
    };

    const dataToMessages = (data) => {
        if(data.length==0) setEnd(true);
        let new_messages = [];
        for(let i=0;i<data.length;i++){
            let new_msg = {user:{}};
            if(data[i].message_id) new_msg._id = data[i].message_id;
            if(data[i].id) new_msg._id = data[i].id;
            new_msg.text = data[i].body;
            new_msg.type = data[i].type;
            new_msg.createdAt = data[i].created_at;
            new_msg.uniqueId = data[i].device_uniqid;

            //add 8 hours
            new_msg.createdAt  = moment(new_msg.createdAt).add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
            // console.log(new_msg.createdAt);

            new_msg.sent = true;
            switch (data[i].type) {
                case 'image': {
                    new_msg.image = data[i].attachment;
                }
                break;
                case 'video': {
                    new_msg.video = data[i].attachment;
                }
                break;
                case 'audio': {
                    new_msg.audio = data[i].attachment;
                }
                break;
             }
            if(data[i].is_sender) new_msg.is_sender = data[i].is_sender;
            else { if(data[i].sender.member_number==userData.member_number) new_msg.is_sender=1; else new_msg.is_sender=0; }
            new_msg.user.name = data[i].sender.name;
            new_msg.user._id = data[i].sender.id;
            new_msg.user.pic = data[i].sender.pic;
            new_messages.push(new_msg);
        }
        return new_messages;
    }

    const Upload = (props) => {
        if(showUpload){
            return (
                <View style={styles.upload}>

                {/* upload video */}
                <TouchableHighlight 
                    onPress={() => {
                        PickImage((url)=>addFilesChosen(url,'video'),(() => setShowFileChosen(false)),'video');
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
                        PickImage((url)=>addFilesChosen(url,'photo'),(() => setShowFileChosen(false)),'photo');
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
                    <TouchableHighlight style={{marginTop:8}} onPress={() => {setShowUpload(false)}}>
                        <View style={styles.uploadItem}>
                            <Text style={styles.uploadText}>取消</Text>
                        </View>
                    </TouchableHighlight>
                    
                </View>
            );
        }
        else return null;
    }

    const addFilesChosen = (fileurl,type) => {
        setShowUpload(false);
        if(type=='photo') setImageUrl(fileurl);
        if(type=='video') setVideoUrl(fileurl);
        setShowFileChosen(true);
    }

    useEffect(() => {
        if(showFileChosen) navigation.setParams({pop: ()=> setShowFileChosen(false)});
        else { navigation.setParams({pop: null}); setImageUrl(''); setVideoUrl('');}
    }, [showFileChosen]) 

    const FileChosen = () => {
        let videoRef;

        return(
            <View style={styles.fileChosen}>
                {imageUrl!=''?(
                    <>
                        <TouchableOpacity 
                            style={{marginLeft:'auto',marginRight:25,marginBottom:10,flexDirection:'row',alignItems: 'center'}}
                            onPress={()=>{setShowCropImage(true)}}
                        >
                            <>
                            <Text style={{fontSize:15,color:'white',marginRight:5}}>編輯相片</Text>
                            <Entypo name="edit" size={15} color="white" />
                            </>
                        </TouchableOpacity>
                        <Image
                            source={{uri:imageUrl}}
                            style={{ width:'95%', height:'90%'}}
                            resizeMode="contain"
                        />
                    </>
                ):(null)}
                {videoUrl!=''?(
                    <Video
                        ref={(ref) => (videoRef = ref)}
                        source={{ uri: videoUrl }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        shouldPlay={true}
                        useNativeControls={true}
                        onReadyForDisplay={()=>videoRef.pauseAsync()}
                        style={{ width:'95%', height:'90%'}}
                        resizeMode="contain"
                    />
                ):(null)}
            </View>
        )
    }

    const renderMessage = (props) => {
        return (
            <TouchableOpacity activeOpacity={1.0} onPress={()=>{
                Keyboard.dismiss();
                setShowAudio(false);
                setShowUpload(false);
            }}>
            <Message
                {...props} 
                containerStyle={{
                    left: styles.messageContainer,
                    right: styles.messageContainer
                }}
            />
            </TouchableOpacity>
        );
    }
    
    const renderBubble = (props) => { 
        let bubbleWrapperStyle,bubbleStyle;

        if (props.currentMessage.type=='system'){
            bubbleWrapperStyle = styles.bubbleWrapperMid;
            bubbleStyle = styles.bubbleMid;
        }
        else {
            if (props.currentMessage.is_sender) {
                bubbleWrapperStyle = styles.bubbleWrapperRight;
                bubbleStyle = styles.bubbleRight;
            }
            else {
                bubbleWrapperStyle = styles.bubbleWrapperLeft;
                bubbleStyle = styles.bubbleLeft;
            }
        }
        return (
            <View style={bubbleWrapperStyle}>
                {props.currentMessage.type!='system' && group.isPrivate==0 && !props.currentMessage.is_sender && props.currentMessage.is_first? (
                    <View style={styles.bubbleUser}>
                        <Avatar.Image size={40} source={{uri:props.currentMessage.user.pic}}/>
                        <Text style={{fontSize:20,marginLeft:10}}>{props.currentMessage.user.name}</Text>
                    </View>
                    ):(null)
                }
                <View style={{flexDirection:'row', alignItems:'center',}}>
                    <View style={[styles.bubble,bubbleStyle]}>
                        <View>
                            {props.currentMessage.type=='image' ? (<MessageImage {...props} />):(null)} 
                            {props.currentMessage.type=='audio' ? (<MessageAudio {...props} />):(null)} 
                            {props.currentMessage.type=='video' ? (<MessageVideo {...props} />):(null)} 
                        </View>
                        <View style={styles.bubbleBottom}>
                            {props.currentMessage.text!='' ? (<Text style={styles.bubbleText}>{props.currentMessage.text}</Text>):(null)} 
                            {props.currentMessage.type!='system'?(
                                <View style={styles.bubbleCorner}>
                                    <Text style={styles.bubbleTime}>{moment(props.currentMessage.createdAt).format('HH:mm')}</Text>
                                    <View>
                                        {/* <Feather style={{marginBottom:-7}} name="check" size={12} color="black" /> */}
                                        {props.currentMessage.is_sender && props.currentMessage.sent? (<Feather name="check" size={12} color="black" />):(null)} 
                                    </View>
                                </View>
                            ):(null)}
                        </View>
                    </View>
                    {props.currentMessage.fail? (<Text>發送失敗</Text>):(null)}
                </View>
            </View>
        );
    }

    const renderSend = (props) => {
        return (
            <Send
                {...props}
                text={text}
                containerStyle={styles.send}
                alwaysShowSend={true}
                children={
                    <View>
                        {text.trim().length == 0 && !showFileChosen?
                            (<TouchableOpacity 
                                onPress={() => {
                                    Keyboard.dismiss();
                                    setShowAudio(!showAudio)
                                    if(onSend==null) setOnSend(() => () => props.onSend(''));
                                }}          
                            >
                                <Image
                                    source={require('@/img/icon_audio.png')}
                                    style={{ width:30, height:30, margin:5}}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>)
                            :(<Text style={{fontSize:18, color:'#993f7e'}}>發送</Text>)
                        }
                    </View>
                }
            > 
            </Send>
        );
    }

    const renderActions = (props) => {
        let upload_button;
        if (!showFileChosen) upload_button = 
            <TouchableOpacity onPress={() => {Keyboard.dismiss();setShowUpload(true)}}>
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
                onPress={()=>console.log(messages[0])}
                // onPress={() => {Chat.kickMember([{id:1871}]);}}          
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
                textInputProps={{
                    value:text,
                    onChangeText:(text)=>{
                        setText(text);
                    },
                    onFocus:()=>{
                        setShowAudio(false);
                        setShowUpload(false);
                    }
                }}
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

    const handleSend = (newMessage = []) => {
        setText('');
        setShowFileChosen(false);

        newMessage[0].user._id = userData.id;
        newMessage[0].user.name = userData.name;
        newMessage[0].user.pic = userData.pic;
        newMessage[0].is_sender = 1;
        newMessage[0].createdAt = moment(newMessage[0].createdAt).format('YYYY-MM-DD HH:mm:ss');
        newMessage[0].uniqueId = Chat.uniqueId();

        if(imageUrl!='') {
            newMessage[0].type = 'image';
            newMessage[0].image = imageUrl;
            Chat.sendFile('image',group.id,imageUrl,newMessage[0].uniqueId);
            setImageUrl('');
        }
        else if(videoUrl!='') {
            newMessage[0].type = 'video';
            newMessage[0].video = videoUrl;
            Chat.sendFile('video',group.id,videoUrl,newMessage[0].uniqueId);
            setVideoUrl('');
        }
        else if(audioUrl!=''){
            newMessage[0].type = 'audio';
            newMessage[0].audio = audioUrl;
            Chat.sendFile('audio',group.id,audioUrl,newMessage[0].uniqueId);
            setAudioUrl('');
        }

        else {
            newMessage[0].type = 'text';
            Chat.sendMsg(group.id,newMessage[0].text,newMessage[0].uniqueId);
        }


        setMessages(newMessage.concat(messages));
        // setMessages(GiftedChat.append(messages, newMessage));
        newMessage[0].new = 1;
        chatDatabase.insertMessages(newMessage,group.id);

        setTimeout(() => {
            checkSendFail(newMessage[0].uniqueId);
        }, 2000);
    }

    const checkSendFail = (uniqueId) => {
        let messages_ = messagesRef.current;
        let index = messages_.findIndex((msg) => msg.uniqueId==uniqueId);
        if(!messages_[index].sent) {
            messages_[index].fail=true;
            setMessages([]);
            setMessages(messages_);
            chatDatabase.updateMessage('fail',uniqueId,1);
        }
    }
    

    return (
    <ImageBackground
        style={{width: '100%', height: '100%',backgroundColor:'black'}}
        resizeMode='cover' 
        source={showFileChosen?(null):(require('@/img/background-7.png'))}
    >
        <GiftedChat
            listViewProps={{
                scrollEnabled: !showFileChosen,
                scrollEventThrottle: 400,
                onEndReached: (e) => {
                    if(initDone) updateOldMessages();
                },
                // onLayout: ({nativeEvent}) => {
                //     console.log(nativeEvent);
                // },
                // onContentSizeChange: (w,h) => {
                //     console.log(w,h);
                // }
            }
        }
        messages={showFileChosen?[{"_id": "0","text": "","user": {"_id": 0,}}] :messages}
        onSend={newMessage => handleSend(newMessage)}
        user={{ _id: 1 }}
        renderAvatar={null}
        renderDay={showFileChosen?(()=>{return(<View></View>)}):null}
        renderTime={() => void 0}
        renderMessage={renderMessage}
        renderBubble={showFileChosen? FileChosen:renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderComposer={renderComposer}
        renderSend={renderSend}
        minInputToolbarHeight={inputBarHeight}
        />
        {showCropImage?(
            <ImageManipulator
                photo={{"uri": imageUrl }}
                isVisible={showCropImage}
                onPictureChoosed={({ uri: uriM }) => setImageUrl(uriM)}
                onToggleModal={()=> { setShowCropImage(false);}}
            />
        ):(null)}
        <Upload/>
        <Record
            onRecordEnd = {(url) => {
                setAudioUrl(url);
                setShowAudio(false);
                onSend('');
            }}
            show={showAudio}
        />

    </ImageBackground>
    );
}

const inputBarHeight = 55;
const styles = StyleSheet.create({
  messageContainer:{
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 0,
    marginRight: 0,
  },
  InputToolbar: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    // justifyContent: 'flex-end'
    minHeight:inputBarHeight,
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
    // padding:2,
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
  fileChosen:{
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems:'center',
    paddingVertical:20,
},
  bubble:{
    borderRadius: 10,
    maxWidth: 180,
    flex:0,
    alignItems:'center',
    justifyContent:'center',
    paddingTop:6,
    paddingBottom:5,
    paddingHorizontal:10,
    marginVertical:6,
  },
  bubbleBox:{
    flexDirection:'row',
    alignItems:'flex-end',
  },
  bubbleBottom:{
    width:'100%',
    // marginTop:5,
    // flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'baseline',
    // marginLeft:'auto',
  },
  bubbleCorner:{
    flexDirection:'row',
    marginLeft:'auto',
    // alignItems:'center',
    alignItems:'flex-end'
  },
  bubbleTime:{
    marginBottom: 2,
    marginRight:2,
    fontSize:12,
    color:'#444444',
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
    marginLeft:15,
  },
  bubbleWrapperRight:{
    marginLeft:'auto',
    marginRight:15,
  },
  bubbleWrapperMid:{
    marginLeft:'auto',
    marginRight:'auto',
  },
  bubbleLeft:{
    backgroundColor:'rgb(219,180,211)',
  },
  bubbleRight:{
    backgroundColor:'rgb(203,203,203)',
  },
  bubbleMid:{
    backgroundColor:'rgb(187,225,248)',
    maxWidth: 250,
  },
});