import mockReques from '@/utils/mockRequest'

const state = {
  homeInfo: {}
}

const actions = {
  getHomeData({ commit }) {
    return new Promise((resolve, reject) => {
      mockReques.get('/home/list').then(response => {
        commit('GETHOMEDATA', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}
const mutations = {
  GETHOMEDATA(state, data) {
    state.homeInfo = data
  }
}
const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}
