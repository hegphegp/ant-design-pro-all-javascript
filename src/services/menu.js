import request from '@/utils/request';

export async function queryCurrentUserMenu(params) {
  return request('http://www.mocky.io/v2/5e775e783300000937099f54', {
    method: 'GET',
    data: params,
  });
}
