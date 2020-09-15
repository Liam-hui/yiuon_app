import { AsyncStorage } from 'react-native';

const prefix = '@AppName:';

export default {
  setAuth: async (auth) => AsyncStorage.setItem('auth', auth),
  getAuth: async () => AsyncStorage.getItem('auth'),
  removeAuth: async () => AsyncStorage.removeItem('auth'),

};
