# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## 安装依赖

```bash
npm install --verbose  # 或者直接用 yarn 命令
```

## 项目的 package.json 的脚本命令

```bash
# 启动项目
npm start
# 打包
npm run build
# 检测代码风格
npm run lint
# lint是静态代码分析，运行命令修复一些lint错误
npm run lint:fix
# 运行测试代码
npm test
```

### 删除国际化

```
npm run i18n-remove
# 删除所有文件名为locales的文件夹
rm -rf `find . -not -path "./node_modules/*" -name locales`
```

### 删掉所有的

```
删除 config/config.js的routes变量中所有关于权限认证的内容
```

- 在 antd 中 src/models/目录的所有 model 的 namespace 的名称都可以作为 connect({})的参数使用，同时 src/pages/模块/子子孙孙模块/可以创建 model.js 文件，该文件的 namespace 是局部的，可以在当前模块使用

#### 在 antd 添加一个路由模块的步骤

- 1. 在 config/config.js 添加 routes 路由信息 path 与对应的 component，其中 component 的控件的起始对照路径是 src/pages
- 2. 是否需要创建 model，在什么情况下需要创建，什么情况下不需要创建，好像都是在 model.js 调用后端接口。有调用后端接口的，都要有 model.js 并写到文件里面。获取左侧菜单有调用后端接口时，有创建 model，并通过 connect({})引入
- 3. 在 src/pages 下面单独创建一个模块文件夹，想通过动态的列表配置 json 自动渲染列表，想通过动态的表单配置 json 自动渲染表单

#### model 参数的使用步骤

- 1. 在 connect({})的参数引入对应的 namespace 名称，这些参数会赋值给该页面的 props 参数

```
  export default connect(({ settings, menu }) => ({
  settings,
  menuData: menu.data,
}))(BasicLayout);
```

- 2. 在该页面的 props 参数读取这些名称的变量，然后在页面直接使用这些变量

```
const BasicLayout = props => {
  const {
    dispatch,
    menuData,
    children,
    settings,
  } = props;
```

- 3. 在 useEffect() 函数中首次加载页面时，触发调用后端接口赋值的 model.js 对应的 namespace 和方法

```
import React, { useEffect } from 'react';
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',  // 打开该页面发现有调用user/fetchCurrent对应的 /api/currentUser 接口
      });
      dispatch({
        type: 'menu/queryCurrentUserMenu',  // 打开该页面发现有调用menu/queryCurrentUserMenu对应的菜单接口
      });
    }
  }, []);
```

- 4. 手动调用 model 的 effects 模块的方法

```
const handleMenuCollapse = payload => {
  if (dispatch) {
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  }
};
```

- 5. 在 model 的 js 文件里面定义 namespace，该文件分为 3 大块，namespace 模块，effects 模块，reducers 模块。
  - effects 模块用于调用 api 接口，主要写法是 yield call(queryUsers); ，调用接口后，用 yield put 方式调用 reducers 模块的方法
  - reducers 模块用于 return 数据，return 的数据格式与 namespace 中 state 的数据一致

```
import { queryCurrent, query as queryUsers } from '@/services/user';
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
```

#### 问题

- global, settings, state 的参数如何混在一起使用，在 model 里面把 global,settings 放进去吗，如果外部动态修改了 global,settings，如果同步修改 model 里面的 global 和 settings 参数

#### 下面的经验总结都是通过浪费生命时间测试总结出来的，这里是比较简介的总结

- global, settings 变量可以在 connect 后面直接使用

```
export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
```

- function mapStateToProps(state) { } state 参数不能用大括号括起来，括起来，点击到那个页面才抛错，不点击那个页面，bug 都找不到

```
function mapStateToProps(state) {  // state用大括号括起来就抛错了  function mapStateToProps({state}) {}
  const { data, total, pagesize } = state.users;
  return {
    data,
    total,
    pagesize,
  };
}
```

- function mapStateToProps(state) { } 参数只能是 state，鬼知道还没有其他参数，试过的其他参数全死了

```
function mapStateToProps(state) {  // state用大括号括起来就抛错了  function mapStateToProps({state, param1, param2}) {}
  const { data, total } = state.users;
  return {
    data,
    total
  };
}
```

- 在 connect 里面引入其他文件的变量，在该文件已经 const 声明了，但是不能直接在 connect 后面的括号加进去，加进去也没有，要在 connect 的方法体内使用就可以了

```
# BasicLayout.jsx的connect引入本地文件的变量
const RouterConfig = require('../../config/config').default.routes;
// export default connect(({ global, settings, RouterConfig}) => { // 错误的写法，RouterConfig不能直接写到connect方法的参数，只能在方法体直接使用
export default connect(({ global, settings }) => {
  console.log("所有路由信息==>>>   "+JSON.stringify(RouterConfig));
  return {
    collapsed: global.collapsed,
    settings,
  };
})(BasicLayout);
```

- 引入根路径的 config/config.js 文件的写法，引入 config/config.js 的变量的写法，config/config.js 文件的 export 是没有名称的，是直接 export 的 export default {}

```
# 写法一
import globalConfig from '../../config/config';
const RouterConfig = globalConfig.routes;

const RouterConfig = require('../../config/config').default.routes;
```

- 无需 import 引入 localStorage，直接使用

```
const map = {"aaa":"aaa","bbb":"bbb"};
localStorage.setItem('antd-pro-authority', JSON.stringify(map));
```

- 获取 URL 上面的所有参数并返回 map 对象

```
import { parse } from 'qs';
function getPageQuery() { // 返回的是map对象
  return parse(window.location.href.split('?')[1]);
}
console.log("url参数==>>"+JSON.stringify(getPageQuery()));

// 例子 http://localhost/login?url=http%3A%2F%2Faaa%2Fbbb&参数=0
输出的是  url参数==>>{"url":"http://aaa/bbb","参数":"0"}
```

- 判断字段的数据类型 判断字段类型 field1.type.typeName === 'LoginTab'

```
if (field1.type.typeName === 'LoginTab') {
    console.log('field1类型名称是LoginTab');
} else {
    console.log('field1类型名称不是LoginTab');
}
```

- const response = yield call(queryCurrentUserMenu); console.log(JSON.stringify(response)); // 打印的就是后端返回的 json 结构数据，没有响应头部的 header，不需要用 response.data 获取数据

- 可能是自己完全不会 antd 吧，之前我用 jquery，easyui，bootstrap 独自开发过很多企业级后台管理系统，都可以看得明白，如今学 antd，发现很多变量无中生有，不需要定义，直接拿来用，那些变量却有值，可怕的事情，鬼知道的事情
- global, settings 变量可以在 connect 后面的参数直接使用，不需要 import 引入，鬼知道有什么参数啊，鬼知道有多少暗箱操作啊
- ProLayout 中定义的菜单，menuDataRender={menuDataRender} ，没有给 menuDataRender 传参，但是在该方法体内输出参数，发现参数有值，太可怕了。后来用 grep -rni 全局扫描除 node_modules 文件夹外的所有文件，没有任何一个参数名为 menuList 变量，但是却有值，太可怕了

```
<ProLayout menuDataRender={menuDataRender}> 调用括号后面的menuDataRender方法时，代码没写传进去的参数，但是在方法体内输出参数却有值
```

#### 这里是一大串废话说明的总结，详细意味着啰嗦，但是不详细，以后又看不懂

- global, settings 变量可以在 connect 后面直接使用，不需要 import 引入，这是规则，不需要任何解。我是 Java 后端开发的，每个变量都要事先申明或者引入才可以使用，不引入却直接用，看到很头晕，因为变量不引入不定义就直接使用，对于初学者鬼知道还有什么变量

```
export default connect(({ global, settings }) => (
  return {
    collapsed: global.collapsed,
    settings,
  };
))(BasicLayout);


#### 在mapStateToProps(state)使用输出 global，settings直接抛错，鬼都不知道为什么不能在mapStateToProps(state)使用
function mapStateToProps({state, global, settings}) {
  console.log("\n\nmapStateToProps(state)=JSON.stringify(global)==>>>"+JSON.stringify(global)+"\n\n\n");
  console.log("\n\nmapStateToProps(state)=JSON.stringify(settings)==>>>"+JSON.stringify(settings)+"\n\n\n");
  return {
    collapsed: global.collapsed,
    settings
  };
}
```
