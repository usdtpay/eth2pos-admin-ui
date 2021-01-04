import request from '@/utils/request';
import qs from 'qs';


export async function userGetCaptcha({ mobile, type }) {
  return request(`/account/getMobileCaptcha?mobile=${mobile}&type=${type}`);
}

export async function userAccountLogin(params) {
  return request('/auth', {
    method: 'POST',
    data: params,
  });

  //
  // const query = qs.stringify(params)
  // return request(`/auth?${query}`);
}

export async function userRegister(params) {
  return request('/account/register', {
    method: 'POST',
    data: params,
  });
}

export async function setPassword(params) {
  return request('/account/retrievePassword', {
    method: 'POST',
    data: params
  })
}

