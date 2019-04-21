import { asyncRouterMap, constantRouterMap, defaultRouterMap } from '@/router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(roles, routes) {
  for (var i = routes.length - 1; i >= 0; i--) {
    var targe = roles[routes[i].name]
    if (targe) {
      if (targe.is_menu !== 1) {
        routes[i].hidden = true
      }
      routes[i].meta.title = targe.title
      routes[i].meta.icon = targe.icon
      if (routes[i].children && routes[i].children.length > 0) {
        filterAsyncRouter(roles, routes[i].children)
      }
    } else {
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
        const { roles } = data
        var accessedRouters = asyncRouterMap
        filterAsyncRouter(roles, accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
