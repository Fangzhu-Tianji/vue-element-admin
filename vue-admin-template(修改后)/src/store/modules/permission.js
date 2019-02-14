import { asyncRouterMap, constantRouterMap, defaultRouterMap } from '@/router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(roles, routes) {
  for (var i = routes.length - 1; i >= 0; i--) {
    var a = false
    for (var j = roles.length - 1; j >= 0; j--) {
      if (routes[i].meta.name === roles[j].name) {
        a = true
        if (routes[i].children && routes[i].children.length > 0) {
          filterAsyncRouter(roles, routes[i].children)
        }
      }
    }
    if (a === false) {
      routes.splice(i, 1)
    }
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      const merge = routers
      // 路由添加404等页面，因为404页面要在最后添加
      state.addRouters = merge.concat(defaultRouterMap)
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        // const { roles } = data
        // 获取后台返回的数据并和accessedRouters进行比较
        // 例
        const roles = [
          {
            'name': 'Nested'
          },
          {
            'name': 'Menu1'
          },
          {
            'name': 'Form'
          },
          {
            'name': 'Form1'
          }
        ]
        var accessedRouters = asyncRouterMap
        filterAsyncRouter(roles, accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
