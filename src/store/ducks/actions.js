import types from "./types";

const drawer_turnon = () => {
    return {
      type: types.DRAWER_TURNON
  };
}

const drawer_turnoff = () => {
  return {
    type: types.DRAWER_TURNOFF
};
}

const loginAction = loginValues => {
  return { type: types.LOGIN_REQUEST, payload: loginValues };
};

const logoutAction = () => {
  return { type: types.LOGOUT_REQUEST };
};

const invalidTokenAction = value =>{
  return { type: types.INVALID_TOKEN, payload: value };
}

const msgResponseAction = value =>{
  return { type: types.MSG_RESPONSE, payload: value };
}

const removeNewMsgAction = value =>{
  return { type: types.REMOVE_MSG, payload: value };
}

export default {
  drawer_turnon,
  drawer_turnoff,
  loginAction,
  logoutAction,
  invalidTokenAction,
  msgResponseAction,
  removeNewMsgAction,
};