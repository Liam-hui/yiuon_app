import axios from 'axios';
import storage from '@/utils/storage';
import store from '@/store';
import actions from '@/store/ducks/actions';


const api = axios.create({
  baseURL: 'http://yiuonapp.itisdemo.com/api/',
});

api.interceptors.request.use(async (config) => {
  const auth = await storage.getAuth();
  const headers = { ...config.headers };

  if (auth) {
    const token = JSON.parse(auth).token;
    headers.Authorization = `Bearer ${token}`;
  }

  return { ...config, headers };
});

api.interceptors.response.use(function (response) {
  if(response.data.msg=='Invalid Access Token') {
    let logginIn = store.getState().auth_state.loggedIn;
    if(logginIn) store.dispatch(actions.invalidTokenAction(true));
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

export default api;
