import request from '@/utils/request';

export async function resourcesList() {
  return request(`/resources/list?`);
}

export async function resourcesCreate(params) {
  return request('/resources/create', {
    method: 'POST',
    data: params,
  });
}

export async function resourcesPrice(params) {
  return request('/resources/price', {
    method: 'POST',
    data: params,
  });
}

export async function resourcesOperationCreate(params) {
  return request('/resources/operation/create', {
    method: 'POST',
    data: params,
  });
}

export async function resourcesOperationPrice(params) {
  return request('/resources/operation/price', {
    method: 'POST',
    data: params,
  });
}


export async function resourcesDetail() {
  return request(`/resources/detail?`);
}
