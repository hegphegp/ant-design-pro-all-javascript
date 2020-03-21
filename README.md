# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## 安装依赖
```bash
npm install --verbose  # 或者直接用 yarn 命令
```

## 项目的package.json的脚本命令
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


* 发现settings变量没有声明，却在connect参数直接使用，在connect中打印，发现取值是
```
{"navTheme":"dark","primaryColor":"#1890ff","layout":"sidemenu","contentWidth":"Fluid","fixedHeader":false,"autoHideHeader":false,"fixSiderbar":false,"colorWeak":false,"menu":{"locale":true},"title":"Ant Design Pro","pwa":false,"iconfontUrl":""}
```
* 发现global变量没有声明，却在connect参数直接使用，在connect中打印，发现取值是
```
{"collapsed":false,"notices":[{"id":"000000001","avatar":"https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png","title":"你收到了 14 份新周报","datetime":"2017-08-09","type":"notification"},{"id":"000000002","avatar":"https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png","title":"你推荐的 曲妮妮 已通过第三轮面试","datetime":"2017-08-08","type":"notification"},{"id":"000000003","avatar":"https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png","title":"这种模板可以区分多种通知类型","datetime":"2017-08-07","read":true,"type":"notification"},{"id":"000000004","avatar":"https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png","title":"左侧图标用于区分不同的类型","datetime":"2017-08-07","type":"notification"},{"id":"000000005","avatar":"https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png","title":"内容不要超过两行字，超出时自动截断","datetime":"2017-08-07","type":"notification"},{"id":"000000006","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"曲丽丽 评论了你","description":"描述信息描述信息描述信息","datetime":"2017-08-07","type":"message","clickClose":true},{"id":"000000007","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"朱偏右 回复了你","description":"这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像","datetime":"2017-08-07","type":"message","clickClose":true},{"id":"000000008","avatar":"https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg","title":"标题","description":"这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像","datetime":"2017-08-07","type":"message","clickClose":true},{"id":"000000009","title":"任务名称","description":"任务需要在 2017-01-12 20:00 前启动","extra":"未开始","status":"todo","type":"event"},{"id":"000000010","title":"第三方紧急代码变更","description":"冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务","extra":"马上到期","status":"urgent","type":"event"},{"id":"000000011","title":"信息安全考试","description":"指派竹尔于 2017-01-09 前完成更新并发布","extra":"已耗时 8 天","status":"doing","type":"event"},{"id":"000000012","title":"ABCD 版本发布","description":"冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务","extra":"进行中","status":"processing","type":"event"}]}
```

#### 问题
* global, settings, state的参数如何混在一起使用，在model里面把global,settings放进去吗，如果外部动态修改了global,settings，如果同步修改model里面的global和settings参数

#### 下面的经验总结都是通过浪费生命时间测试总结出来的，这里是比较简介的总结
* global, settings 变量可以在 connect 后面直接使用
```
export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
```

* function mapStateToProps(state) { } state参数不能用大括号括起来，括起来，点击到那个页面才抛错，不点击那个页面，bug都找不到
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

* function mapStateToProps(state) { } 参数只能是state，鬼知道还没有其他参数，试过的其他参数全死了
```
function mapStateToProps(state) {  // state用大括号括起来就抛错了  function mapStateToProps({state, param1, param2}) {}
  const { data, total } = state.users;
  return {
    data,
    total
  };
}
```




* 可能是自己完全不会antd吧，之前我用jquery，easyui，bootstrap独自开发过很多企业级后台管理系统，都可以看得明白，如今学antd，发现很多变量无中生有，不需要定义，直接拿来用，那些变量却有值，可怕的事情，鬼知道的事情
* global, settings 变量可以在 connect 后面的参数直接使用，不需要import引入，鬼知道有什么参数啊，鬼知道有多少暗箱操作啊
* ProLayout中定义的菜单，menuDataRender={menuDataRender} ，没有给menuDataRender传参，但是在该方法体内输出参数，发现参数有值，太可怕了。后来用 grep -rni 全局扫描除node_modules文件夹外的所有文件，没有任何一个参数名为menuList变量，但是却有值，太可怕了
```
<ProLayout menuDataRender={menuDataRender}> 调用括号后面的menuDataRender方法时，代码没写传进去的参数，但是在方法体内输出参数却有值 
```









#### 这里是一大串废话说明的总结，详细意味着啰嗦，但是不详细，以后又看不懂
* global, settings 变量可以在 connect 后面直接使用，不需要import引入，这是规则，不需要任何解。我是Java后端开发的，每个变量都要事先申明或者引入才可以使用，不引入却直接用，看到很头晕，因为变量不引入不定义就直接使用，对于初学者鬼知道还有什么变量
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