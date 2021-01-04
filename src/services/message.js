
import request from '@/utils/request';
import qs from 'qs';

export async function messageList() {
  return request(`/message/list?`);
}

export async function getMessages(params) {
  params.page = params.current;
  const query = qs.stringify(params)

  return request(`/message/getMessages?${query}`);

}

