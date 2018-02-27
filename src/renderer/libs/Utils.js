// 引入需要的核心文件
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import crypto from 'crypto'

// 声明变量
let logPath = 'logs'
let historyPath = 'history'
let utils = {

}

/**
 * 扫描文件
 * @param files 文件名
 * @param filePath 文件路径
 */
utils.scanDir = function(files, filePath) {
  // 是文件
  if (fs.statSync(filePath).isFile()) {
    // 是 json文件
    if (path.extname(filePath).toLowerCase() === '.json') {
      var tmp = {}
      tmp.value = path.basename(filePath, '.json')
      tmp.path = filePath
      return files.push(tmp)
    }
  } else {
    try {
      fs.readdirSync(filePath).forEach(function (file) {
        utils.scanDir(files, path.resolve(filePath, file))
      })
    } catch (e) {
      this.llog(filePath + '不是文件路径')
    }
  }
  return files
}

/**
 * 判断是否空对象
 * 
 * @param e 目标对象
 */
utils.isEmptyObject = function(e) {
  var t
  for (t in e) {
    console.log(t)
    return !1
  }
  return !0
}

/**
 * 输出返回结果到文件中
 * 
 * @param {String} content 
 */
utils.llog = function (content) {
  var timestamp = moment().format('YYYY-MM-DD HH:mm:ss')
  content = '[' + timestamp + ']:' + content + '\n'
  // 先判断日志文件夹是否存在
  if (!fs.existsSync(logPath)) {
    // 创建文件夹
    fs.mkdirSync(logPath)
  }
  // 默认输出文件
  fs.appendFile(logPath + '/script_log.log', content, 'utf8', (err) => {
    if (err) {
      console.log(err)
    }
  })
  // 追加返回结果
}

/**
 * 保存请求的内容至文件，在历史页面展示
 * 以时间(YYYY-MM-DD)作为文件名，以时间戳作为文件名（Req-HHmmssSSS.json）
 * 可能多个页面都会用到，所以就现在公共方法内
 * 
 * @param content 内容
 */
utils.saveHistory = function (vm, content) {
  let today = moment().format('YYYY-MM-DD')
  // 如果历史文件根目录不存在则创建
  if (!fs.existsSync(historyPath)) {
    // 创建文件夹
    fs.mkdirSync(historyPath)
  }
  if (!fs.existsSync(historyPath + '/' + today)) {
    // 创建今天的文件夹
    fs.mkdirSync(historyPath + '/' + today)
  }
  // 获取文件名
  let fileName = historyPath + '/' + today + '/Req-' + moment().format('HHmmssSSS') + '.json'

  // 默认输出文件
  fs.appendFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.log(err)
    }
    vm.$store.commit('setHistory', utils.listHistoryFiles().reverse())
  })
}

/**
 * 5.获取历史记录下的文件夹名
 */
utils.listHistoryDays = function () {
  let result = []
  try {
    fs.readdirSync(historyPath).forEach(function (file) {
      if (!fs.statSync(historyPath + '/' + file).isFile()) {
        let tmp = {}
        tmp.value = file
        result.push(tmp)
      }
    })
  } catch (e) {
    this.llog(historyPath + '文件夹不存在或下面无文件夹')
  }
  return result
}

/**
 * 6.获取该文件夹下的文件
 * @param {String} folder
 */
utils.listHistoryReqs = function (folder) {
  let filePath = historyPath + '/' + folder
  let result = []
  try {
    fs.readdirSync(filePath).forEach(function (file) {
      if (fs.statSync(filePath + '/' + file).isFile()) {
        // 是 json文件
        if (path.extname(file).toLowerCase() === '.json') {
          let tmp = {}
          tmp.name = path.basename(file, '.json')
          let fileData = fs.readFileSync(filePath + '/' + file)
          tmp.content = JSON.parse(fileData)
          result.push(tmp)
        }
      }
    })
  } catch (e) {
    this.llog(filePath + '文件夹不存在或下面无文件夹')
  }
  return result
}

/**
 * 列出历史记录下的所有文件
 */
utils.listHistoryFiles = function() {
  let result = []
  // 如果历史文件根目录不存在则创建
  if (!fs.existsSync(historyPath)) {
    // 创建文件夹
    fs.mkdirSync(historyPath)
    return result
  }
  // 读取文件
  try {
    // 日期二级文件夹
    fs.readdirSync(historyPath).forEach(function (pfile) {
      if (!fs.statSync(historyPath + '/' + pfile).isFile()) {
        let tmp = {
          name: '',
          files: []
        }
        tmp.name = pfile
        fs.readdirSync(historyPath + '/' + pfile).forEach(function (sfile) {
          let filePath = historyPath + '/' + pfile + '/' + sfile
          let fileData = utils.readFile(filePath, false)
          if (!!fileData) {
            tmp.files.push(fileData)
          }
        })
        // 倒序排序
        tmp.files = tmp.files.reverse()
        result.push(tmp)
      }
    })
  } catch (e) {
    this.llog(historyPath + '文件夹不存在或下面无文件夹')
  }
  return result
}

/**
 * 获取文件内容，并组装成规定格式
 * 
 * @param {string} filePath 文件路径
 * @param {boolean} withData 是否带上内容
 */
utils.readFile = function(filePath, withData) {
  let result = {
    name: '',
    method: '',
    data: '',
    filePath: filePath
  }
  // 是文件并且存在
  if (fs.statSync(filePath).isFile()) {
    // 是 json文件
    if (path.extname(filePath).toLowerCase() === '.json') {
      result.name = path.basename(filePath, '.json')
      let fileData = fs.readFileSync(filePath)
      try {
        let data = JSON.parse(fileData)
        // 需要带上内容
        if (!!withData) {
          result.data = data
        }
        result.method = data.method || ''
        return result
      } catch(e) {
        this.llog(filePath + "转换JSON出错，请检查")
      }
    }
  }
  return
}

/**
 * 获取文件对象
 * 
 * @param {array} files 
 * @param {string} name 
 */
utils.getFileDataByName = function (files, name) {
  if (!name || !files || !files.length) {
      return null;
  }
  let fileData = null;
  for (let pfile of files) {
    for (let item of pfile.files) {
      if (item.name === name) {
          return item;
      }
    }
  }
  return null;
}

/**
 * base64 转码
 * 
 * @param obj 
 */
utils.base64 = function (obj) {
  if (!obj) {
    return
  }
  var tmp = obj
  if (typeof obj === 'object') {
    tmp = JSON.stringify(obj)
  }
  var buf = new Buffer(tmp)
  return buf.toString('base64')
}

/**
 * 签名
 * 用户信息签名
 * 
 * @param {*} body 消息体
 * @param {*} pk 平台私钥
 */
utils.sign = function (body, pk) {
  if (typeof body === 'object') {
    body = JSON.stringify(body)
  }
  var sign = crypto.createSign('SHA1')
  sign.update(body)
  return sign.sign(pk, 'base64')
}

/**
 * 公钥加密
 * 用于密码加密
 * 
 * @param {*} body 
 * @param {*} pk 
 */
utils.pkEncrypt = function (body, pk) {
  if (typeof body === 'object') {
    body = JSON.stringify(body)
  }
  var content = new Buffer(body)
  var encrypt = crypto.publicEncrypt(pk, content)
  return encrypt.toString('base64')
}

/**
 * 从本地存储获取值
 * 
 * @param {*} item key值
 * @param {*} dval 默认值
 */
utils.getFromLocal = function (item, dval) {
  var result = localStorage.getItem(item)
  if (!result) {
    return dval
  }
  return result
}

/**
 *从本地存储获取布尔值
 *
 * @param {*} item 
 * @param {*} dval 
 */
utils.getBooleanFromLocal = function (item, dval) {
  var result = localStorage.getItem(item)
  if (!result) {
    return dval
  }
  return result === 'true'
}

export default utils;