import request from '@/utils/request';

export async function queryCurrentUserMenu(params) {
  return request('/api/menus', {
    method: 'GET',
    data: params,
  });
}
