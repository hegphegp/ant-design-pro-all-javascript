import { queryCurrentUserMenu } from '@/services/menu';

const MenuModel = {
  namespace: 'menu',
  state: {
    data: [],
  },

  effects: {
    // *queryCurrentUserMenu({ payload }, { call, put }) {
    *queryCurrentUserMenu(_, { call, put }) {
      const menuData = yield call(queryCurrentUserMenu);
      // console.log("后端请求的菜单数据==>>>  "+JSON.stringify(menuData)); // 有console时，git commit的eslint语法校验不通过
      yield put({
        type: 'save',
        payload: { data: menuData.data },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default MenuModel;
