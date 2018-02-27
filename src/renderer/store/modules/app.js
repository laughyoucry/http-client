import utils from '@/libs/Utils'

const state = {
  req: {
    appid: utils.getFromLocal('req_appid', ''),
    uri: utils.getFromLocal('req_uri', ''),
    method: utils.getFromLocal('req_method', 'GET'),
    body: utils.getFromLocal('req_body', '{}')
  },
  res: {
    body: utils.getFromLocal('res_body', '')
  },
  historyFiles: utils.listHistoryFiles().reverse()
}

const mutations = {
  setReq (state, req) {
    if (!req) {
      return
    }
    state.req.appid = req.appid || ''
    state.req.uri = req.uri || ''
    state.req.method = req.method || 'GET'
    state.req.body = req.body || '{}'
    console.log("保存成功" + req.toString())
  },
  setRes (state, res) {
    state.res.body = res.body
  },
  setHistory (state, files) {
    if (!files) {
      return
    }
    state.historyFiles = files
    console.log("保存历史记录成功" + JSON.stringify(files))
  }
}

export default {
  state,
  mutations
}
