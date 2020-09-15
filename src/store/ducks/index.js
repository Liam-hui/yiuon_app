import { combineReducers,createStore } from 'redux';
import types from "./types";


const drawerReducer = ( state = false, action ) => {
  switch( action.type ) {
      case types.DRAWER_TURNON:
        return true
      case types.DRAWER_TURNOFF:
        return false
      default: return state;
  }
}

const msgReducer = ( state = [], action ) => {
  switch( action.type ) {
      case types.INSERT_MSG:
        return state.concat(action.payload)
      case types.REMOVE_MSG:
        return state.filter(x => x.id != action.payload)
      default: return state;
  }
}

const invalidTokenReducer = ( state = false, action ) => {
  switch( action.type ) {
      case types.INVALID_TOKEN:
        return action.payload
      case types.LOGOUT_FINISH:
        return false
      default: return state;
  }
}

const defaultAuthState = {
  loggedIn:false,
  userType: '',
  userData: [],
};

const authReducer = (state = defaultAuthState, action) => {
  switch (action.type) {
    case types.LOGIN_FINISH: {
      return {
        ...action.payload,
      };
    }
    case types.LOGOUT_FINISH: {
      return {
        ...defaultAuthState
      };
    }
    default: {
      return state;
    }
  }
};

const reducers = combineReducers({
  drawer_on: drawerReducer,
  auth_state: authReducer,
  invalidToken: invalidTokenReducer,
  newMessages: msgReducer,
});

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default reducers;
