import request from '@/utils/request';

export async function queryCurrentUserMenu(params) {
  return request('http://www.mocky.io/v2/5e7741603300002900099f1d', {
    method: 'GET',
    data: params,
  });
}
