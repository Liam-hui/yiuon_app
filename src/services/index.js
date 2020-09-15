import api from '@/services/api';
import actions from '@/store/ducks/actions';
import store from '@/store';
import {Chat} from '@/pages/Chat/handle_chat';

export const Services = {
  //get
  get,

  //user
  logIn,
  logOut,
  forget_password,
  change_password,
  change_pic,

  //chat
  get_rooms,
  get_user_list_chat,
  two_people_chat,
  get_new_messages,
  send_msg,
  upload_video,
  update_group,
  create_group,
  delete_group,
  add_member_to_group,
  remove_member_from_group,


  //album
  upload_image_to_album,
  set_album_cover,
  create_album,

  //info
  fav_toggle,
};

//get
function get(url,set,errorFunc,after) {
  api.get(url, {
  })
  .then((response) => {
    if(response.data.status=='success') {
      set(response.data.payload);
      if(after) after();
    }
    else if(errorFunc)errorFunc();
  }, (error) => {
    console.log(error);
    if(errorFunc)errorFunc();
  });
}

//user
function logIn(member_number,password,setFail,after) {
  let body = new FormData();
  body.append('member_number', member_number);
  body.append('password', password);
  body.append('uniID', 'test2');
  body.append('OsType', 'ios');
  body.append('OsVersion', '1');
  body.append('VersionCode', '1');
  body.append('BuildNo', '1');
  body.append('DeviceName', 'test');

  api.post('user/login', body,{
  })
  .then((response) => {
    console.log('a',response.data.payload);
    if(response.data.status=='success') store.dispatch(actions.loginAction(response.data.payload));
      else {setFail(1); if(after)after();}
  }, (error) => {
    console.log(error);
  });
}

function logOut() {
  api.post('user/logout', {
  })
  .then((response) => {
    // if(response.data.status=='success') store.dispatch(actions.logoutAction());
    store.dispatch(actions.logoutAction());
  }, (error) => {
    console.log(error);
    store.dispatch(actions.logoutAction());
  });
}


function forget_password(member_number,password,password_confirmation,setWarning) {
  let body = new FormData();
  body.append('member_number', member_number);
  body.append('password', password);
  body.append('password_confirmation', password_confirmation);

  api.post('user/forgetPassword', body,{
  })
  .then((response) => {
    if(response.data.status=='success') setWarning('更改密碼成功!');
  }, (error) => {
    console.log(error);
  });
}

function change_password(member_number,old_password,password,password_confirmation,setWarning) {
  let body = new FormData();
  body.append('member_number', member_number);
  body.append('old_password', old_password);
  body.append('password', password);
  body.append('password_confirmation', password_confirmation);

  api.post('user/changePassword', body,{
  })
  .then((response) => {
    console.log('adaf',response.data);
    if(response.data.status=='error'){
      // if(response.data.payload) setWarning(response.data.payload[0]);
      if(response.data.msg=="Incorrect Password") setWarning('密碼錯誤!');
    }
    else if(response.data.status=='success') setWarning('更改密碼成功!');
  }, (error) => {
    console.log(error);
  });
}

function change_pic(uri,set) {
  let body = new FormData();
  const type = uri.split('.').pop();
  const name = uri.split('/').pop();
  console.log(name);
  const photo = {
    uri: uri,
    type: 'image/'+type,
    name: 'name',
  };
  body.append('image', photo);

  api.post('user/uploadProfile', body,{
  })
  .then((response) => {
    console.log(response.data);
    if(set) set();
  }, (error) => {
    console.log(error);
  });
}


//album
function upload_image_to_album(id,uri,getID) {
  let body = new FormData();
  const format = uri.split('.').pop();
  const photo = {
    uri: uri,
    type: 'image/'+format,
    name: 'photo.jpg',
  };
  body.append('image', photo);

  api.post('album/photo/'+id, body,{
  })
  .then((response) => {
    console.log('dsd',response.data);
    if(getID) getID(response.data.payload.id);
  }, (error) => {
    console.log(error);
  });
}

function set_album_cover(album_id,photo_id) {
  let body = new FormData();
  body.append('album_id', album_id);
  body.append('photo_id', photo_id);

  api.post('album/setCover', body,{
  })
  .then((response) => {
    // console.log('dsd',response.data);
    // if(getID) getID(response.data.payload.id);
  }, (error) => {
    console.log(error);
  });
}

function create_album(title,date_for_display,getID) {
  let body = new FormData();
  body.append('title', title);
  body.append('date_for_display', date_for_display);

  api.post('album', body,{
  })
  .then((response) => {
    getID(response.data.payload.id);
  }, (error) => {
    console.log(error);
  });
}


//chat
function get_rooms(init,getStored) {
  api.get('chat/getRooms', {
  })
  .then((response) => {
    if(response.data.payload) init(response.data.payload);
    else getStored();
  }, (error) => {
    console.log(error);
    getStored();
  });
}

function get_user_list_chat(set) {
  // const token = storage.getToken();
  // console.log(storage.getToken());
    api.get('user/list', {
      // firstName: 'Finn',
    })
    .then((response) => {
      // console.log(response.data.payload.data);
      set(response.data.payload.data);
    }, (error) => {
      console.log(error);
    });
}

function two_people_chat(targetID,set) {
  let body = new FormData();
  body.append('targetID', targetID);

  api.post('chat/singleGroup', body,{
  })
  .then((response) => {
    console.log(response.data.payload);
    set(response.data.payload);
  }, (error) => {
    console.log(error);
  });
}

function get_new_messages(id,lastId) {
  let i = 0;
  let next = ' ';
  while(i<3){
    api.get('chat/getMessages?conversationID='+id+'&lastID='+lastId, {
    })
    .then((response) => {
      // set(response.data.payload);
      // console.log('s',response.data.payload);
      next = response.data.payload.next_page_url;
      console.log(next);
    }, (error) => {
      console.log(error);
    });
    i++;
  }
}

function send_msg(conversationID,type,message,after,file) {
  let body = new FormData();
  body.append('conversationID', conversationID);
  body.append('type', type);
  body.append('message', message);

  if(type=='image'){
    const format = file.split('.').pop();
    const photo = {
      uri: file,
      type: 'image/'+format,
      name: 'image.'+format,
    };
    body.append('file', photo);
  }

  if(type=='video'){
    const format = file.split('.').pop();
    const video = {
      uri: file,
      type: 'video/'+format,
      name: 'video.'+format,
    };
    body.append('file', video);
  }

  if(type=='audio'){
    const format = file.split('.').pop();
    const photo = {
      uri: file,
      type: 'audio/'+format,
      name: 'audio.'+format,
    };
    body.append('file', photo);
  }

  api.post('chat/sendMessage', body,{
  })
  .then((response) => {
    // console.log(response.data);
    after();
  }, (error) => {
    console.log(error);
  });
}

function upload_video(conversationID,message,file,after) {
  let body = new FormData();
  body.append('conversationID', conversationID);
  body.append('message', message);

  const format = file.split('.').pop();
  const video = {
    uri: file,
    type: 'video/'+format,
    name: 'video.'+format,
  };
  body.append('file', video);

  api.post('chat/uploadVideo', body,{
  })
  .then((response) => {
    console.log(response.data);
    if(after)after();
  }, (error) => {
    console.log(error);
  });
}

function update_group(conversationID,title,after) {
  let body = new FormData();
  body.append('conversationID', conversationID);
  body.append('title', title);

  api.post('chat/updateGroup', body,{
  })
  .then((response) => {
    console.log(response.data);
    if(response.data.status=='success' && after) after();;
  }, (error) => {
    console.log(error);
  });
}

function create_group(members,title,image,after) {
  let body = new FormData();
  members.forEach(member=>{
    body.append('ids[]', member.id);
  })
  body.append('title', title);
  if(image!=''){
    const format = image.split('.').pop();
    const photo = {
      uri: image,
      type: 'image/'+format,
      name: 'image.'+format,
    };
    body.append('image', photo);
  }

  api.post('chat/createGroup', body,{
  })
  .then((response) => {
    if(response.data.status=='success') {
      after(response.data.payload);
      get_rooms((data)=>{Chat.joinRooms(data)});
      Chat.kickMember(response.data.payload.users);
    }
  }, (error) => {
    console.log(error);
  });
}

function delete_group(id,after) {
  api.post('chat/delete/'+id, {
  })
  .then((response) => {
    if(response.data.status=='success' && after) after();;
  }, (error) => {
    console.log(error);
  });
}

function add_member_to_group(conversationID,members,after) {
  let body = new FormData();
  members.forEach(member=>{
    body.append('ids[]', member.id);
  })
  body.append('conversationID', conversationID);

  api.post('chat/addMember', body,{
  })
  .then((response) => {
    console.log(response.data);
    if(response.data.status=='success') {
      if(after) after();
    }
  }, (error) => {
    console.log(error);
  });
}

function remove_member_from_group(conversationID,id,after) {
  let body = new FormData();
  body.append('ids[]', id);
  body.append('conversationID', conversationID);

  api.post('chat/removeMember', body,{
  })
  .then((response) => {
    console.log(response.data);
    if(response.data.status=='success' && after) after();
  }, (error) => {
    console.log(error);
  });
}


//info
function fav_toggle(id) {
  let body = new FormData();
  body.append('event_id', id);

  api.post('event/fav', body,{
  })
  .then((response) => {
    // alert(response.data.status);
  }, (error) => {
    console.log(error);
  });
}



