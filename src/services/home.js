import request from '@/utils/request';
import qs from 'qs';

export async function homeFlow(params) {
  const { date, channel } = params;
  if (channel === '') {
    return request(`/home/flow/${date}`);
  }
  return request(`/home/flow/${date}/${channel}`);
}

export async function homeSpace(params) {
  return request(`/home/space`);
}

export async function  getFilesDistribution (type) {
  return request(`/fileSummary/getFilesDistribution/${type}`,{
    method:'GET',
  })
}
export async function  getFilesCountDistribution (type) {
  return request(`/fileSummary/getFilesCountDistribution/${type}`,{
    method:'GET',
  })
}
export async function  getMachineRoomDistribution (type) {
  return request(`/fileSummary/getMachineRoomDistribution`,{
    method:'GET',
  })
}
