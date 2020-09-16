import Axios from 'axios';
import { LOGIN_USER } from './types';

export function loginUser(dataToSubmit) {
  const request = Axios.post('/api/user/login', dataToSubmit)
    .then(res => res.data);
  
  return {
    type: LOGIN_USER,
    payload: request
  }
}