const state = {
  hisToOper: 0,
  operToHis: 0
}

const mutations = {
  INCREMENT_HIS_COUNTER (state) {
    state.hisToOper++
  },
  INCREMENT_OPER_COUNTER (state) {
    state.operToHis++
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_HIS_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
