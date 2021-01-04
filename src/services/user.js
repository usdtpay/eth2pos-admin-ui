import request from '@/utils/request';
import qs from 'qs';

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function userInfo() {
  return request('/account/userInfo');
}

export async function queryBalance() {
  return request('/cost/balance');
}

export async function rechargePay(params) {
  const query = qs.stringify(params)
  return request(`/recharge/trade?${query}`, {
  });
}


export async function modifyMobile(params) {
  return request('/account/modifyMobile', {
    method: 'POST',
    data: params,
  });
}

export async function modifyPassword(params) {
  return request('/account/modifyPassword', {
    method: 'POST',
    data: params,
  });
}

export async function billLog(params) {
  params.page = params.current;
  const query = qs.stringify(params)
  return request(`/cost/log?${query}`);
}
