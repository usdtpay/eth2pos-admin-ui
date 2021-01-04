import request from '@/utils/request';
import qs from 'qs';
import config from '@/config'
import  {downloadFile} from '@/utils/utils'


//取调价系数
export const URL_GET_RATE = `/getPriceRate`;
//设调价系数
export const URL_SET_RATE = `/setPriceRate`;
//取ETH2总量
export const URL_GET_ETH2AMOUNT = `/getEth2Amount`;
//设ETH2总量
export const URL_SET_ETH2AMOUNT = `/setEth2Amount`;
//导出算力
export const URL_EXPORT_POWER_LIST = `/exportPowerList`;


export async function exportPowerList(value) {
  let params = {
    amount:value
  };
  const query = qs.stringify(params);
  return request(`${URL_EXPORT_POWER_LIST}?${query}`);
}


export async function getRate() {
  return request(URL_GET_RATE);
}

export async function getEth2Amount() {
  return request(URL_GET_ETH2AMOUNT);
}

export async function saveRate(value) {
  let params = {
    rate:value
  };
  const query = qs.stringify(params);
  return request(`${URL_SET_RATE}?${query}`);
}

export async function saveEth2Amount(value) {
  let params = {
    rate:value
  };
  const query = qs.stringify(params);
  return request(`${URL_SET_ETH2AMOUNT}?${query}`);
}
