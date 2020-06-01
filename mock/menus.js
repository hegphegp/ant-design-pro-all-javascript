export default {
  // 获取菜单
  'GET /api/menus': {
    "code": 200,
    "msg": "success",
    "data": [{
        "path": "/dashboard",
        "name": "面板",
        "icon": "table",
        "children": [{
            "name": "分析页",
            "icon": "table",
            "path": "/dashboard/analysis"
        }, {
            "name": "监控页",
            "icon": "table",
            "path": "/dashboard/monitor"
        }, {
            "name": "工作台",
            "icon": "table",
            "path": "/dashboard/workplace"
        }]
    }, {
        "path": "/form",
        "icon": "table",
        "name": "表单页",
        "children": [{
            "name": "基础表单",
            "icon": "table",
            "path": "/form/basic-form"
        }, {
            "name": "分步表单",
            "icon": "table",
            "path": "/form/step-form"
        }, {
            "name": "高级表单",
            "icon": "table",
            "path": "/form/advanced-form"
        }]
    }, {
        "path": "/list",
        "icon": "table",
        "name": "列表页",
        "children": [{
            "path": "/list/search",
            "name": "搜索列表",
            "children": [{
                "name": "搜索列表（文章）",
                "icon": "table",
                "path": "/list/search/articles"
            }, {
                "name": "搜索列表（项目）",
                "icon": "table",
                "path": "/list/search/projects"
            }, {
                "name": "搜索列表（应用）",
                "icon": "table",
                "path": "/list/search/applications"
            }]
        }, {
            "name": "查询表格",
            "icon": "table",
            "path": "/list/table-list"
        }, {
            "name": "标准列表",
            "icon": "table",
            "path": "/list/basic-list"
        }, {
            "name": "卡片列表",
            "icon": "table",
            "path": "/list/card-list"
        }]
    }, {
        "path": "/profile",
        "name": "详情页",
        "icon": "table",
        "children": [{
            "name": "基础详情页",
            "icon": "table",
            "path": "/profile/basic"
        }, {
            "name": "高级详情页",
            "icon": "table",
            "path": "/profile/advanced"
        }]
    }, {
        "name": "结果页",
        "icon": "table",
        "path": "/result",
        "children": [{
            "name": "成功页",
            "icon": "table",
            "path": "/result/success"
        }, {
            "name": "失败页",
            "icon": "table",
            "path": "/result/fail"
        }]
    }, {
        "name": "异常页",
        "icon": "table",
        "path": "/exception",
        "children": [{
            "name": "403",
            "icon": "table",
            "path": "/exception/403"
        }, {
            "name": "404",
            "icon": "table",
            "path": "/exception/404"
        }, {
            "name": "500",
            "icon": "table",
            "path": "/exception/500"
        }]
    }, {
        "name": "个人页",
        "icon": "table",
        "path": "/account",
        "children": [{
            "name": "个人中心",
            "icon": "table",
            "path": "/account/center"
        }, {
            "name": "个人设置",
            "icon": "table",
            "path": "/account/settings"
        }]
    }, {
        "name": "图形编辑器",
        "icon": "table",
        "path": "/editor",
        "children": [{
            "name": "流程编辑器",
            "icon": "table",
            "path": "/editor/flow"
        }, {
            "name": "脑图编辑器",
            "icon": "table",
            "path": "/editor/mind"
        }, {
            "name": "拓扑编辑器",
            "icon": "table",
            "path": "/editor/koni"
        }]
    }, {
        "name": "外链",
        "icon": "table",
        "children": [{
            "name": "百度",
            "icon": "table",
            "path": "https://www.baidu.com"
        }, {
            "name": "微博",
            "icon": "table",
            "path": "https://weibo.com/"
        }, {
            "name": "必应",
            "icon": "table",
            "path": "https://cn.bing.com/"
        }]
    }]
}
};