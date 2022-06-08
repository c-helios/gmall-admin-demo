import { login, logout, getInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

// 路由模块当中重置路由的方法
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限的信息
    buttons: [],
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的理由】
    resultAsyncRoutes: [],
    // 用户最终需要展示全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 给路由器添加新的路由
    resetRouter([])
    router.addRoutes(state.resultAllRoutes)
  }
}

// 定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item => {
    // 数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1
    if (routes.indexOf(item.name) !== -1) {
      // 递归:别忘记还有2、3、4、5、6级路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        commit('SET_USER', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(cloneDeep(asyncRoutes), data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter([])
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

