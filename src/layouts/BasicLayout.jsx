/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Result, Button, version } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import { Icon } from '@ant-design/compatible';
import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */

// const menuDataRender = menuList => {
//   menuList.map(item => {
//     return { ...item, children: item.children ? menuDataRender(item.children) : [] };
//     // return Authorized.check(item.authority, localItem, null);
//   });
// return menuList;
// };

// 这种写法扑街了，自己死了都不知道什么回事
// 直接返回 return menuList.map()  而不是返回 return menuList;
// const menuDataRender = menuList => {
//   menuList.map(({ icon, ...item }) => {
//     const localItem = {
//       ...item,
//       icon: icon && IconMap[icon],
//       children: item.children ? menuDataRender(item.children) : [],
//     };
//     return localItem;
//   });
//   return menuList;
// };

const menuDataRender = menuList => {
  return menuList.map(({ icon, ...item }) => {
    const localItem = {
      ...item,
      icon: icon ? icon && <Icon type={icon} /> : <Icon type="smile" />,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return localItem;
  });
};

// const menuDataRender = menuList => {
//   return menuList.map(({ icon, children, ...item }) => {
//     return { ...item, icon: icon && IconMap[icon], children: children ? menuDataRender(children) : []};
//   });
// }

const defaultFooterDom = (
  <DefaultFooter
    copyright="2019 蚂蚁金服体验技术部出品"
    links={[
      {
        key: 'Ant Design Pro',
        title: `Ant Design Pro版本 ${version}`,
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const footerRender = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout = props => {
  const {
    dispatch,
    menuData,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'menu/queryCurrentUserMenu',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <>
      <ProLayout
        logo={logo}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          // console.log("\n\nmenuItemRender==>>> "+JSON.stringify(menuItemProps));
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        menuDataRender={() => menuDataRender(menuData)}
        // menuDataRender={menuDataRender} // 第一个menuDataRender的类型是一个函数，第二个menuDataRender的类型也是一个函数，这句的意思是把当前页面定义的menuDataRender函数作为ProLayout空间的menuDataRender函数
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={config =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(({ global, settings, menu }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menu.data,
}))(BasicLayout);

// export default connect(({ global, settings, menu }) => {
//   console.log("connect的菜单数据==>>>  "+JSON.stringify(menu.data));
//   return {
//   collapsed: global.collapsed,
//   settings,
//   menuData: menu.data,
// };
// })(BasicLayout);

// export default connect(({ global, settings, menu }) => {
//   console.log("connect的菜单数据==>>>  "+JSON.stringify(menu.data));
//   return {
//   collapsed: global.collapsed,
//   settings,
//   menuData: menu.data,
// };
// })(BasicLayout);

/** 写法二，不写return，用括号()替换把{ return }; */
// export default connect(({ global, settings }) => (
//   {
//     collapsed: global.collapsed,
//     settings,
//   }
// ))(BasicLayout);
