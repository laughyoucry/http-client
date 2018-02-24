<template>
  <div>
    <AutoComplete
      placeholder="选择模版"
      icon="ios-search"
      @on-search="handleSearch"
      @on-select="handleSelect"
      >
      <div style="height=200px;">
        <Option v-for="item in req.showApis" :value="item.path" :key="item.value">{{ item.value }}</Option>
      </div>
    </AutoComplete>
    <Input
      v-model="req.appid" 
      placeholder="输入appid"
      style="margin-top:8px;">
      <span slot="prepend" style="width:80px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;APPID:&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </Input>
    <Input 
      v-model="req.uri"
      placeholder="输入请求URL"
      style="margin-top:8px;">
      <Select v-model="req.method" slot="prepend" style="width: 82px">
          <Option value="GET">GET</Option>
          <Option value="POST">POST</Option>
          <Option value="PUT">PUT</Option>
          <Option value="DELETE">DELETE</Option>
      </Select>
      <Button slot="append" icon="ios-search" @click="sendMsg">发送</Button>
    </Input>
    <div style="margin-top:8px">
      <Card>
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          请求
        </p>
        <Input 
          v-model="req.body" 
          type="textarea"
          :rows=6
          style="font-family:monospace;"
          placeholder="JSON格式请求体">
        </Input>
      </Card>
    </div>
    <div style="margin-top:8px">
      <Card>
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          响应
        </p>
        <code>
          <pre>{{ res.body }}</pre>
        </code>
      </Card>
    </div>
  </div>
</template>
<script>
  import utils from '@/libs/Utils'
  import moment from 'moment'
  import request from 'request'
  import fs from 'fs'
  import path from 'path'

  export default{
    data () {
      return {
        req: {
          'api': '',
          'apis': this.loadAll(),
          'showApis': this.loadAll(),
          'appid': utils.getFromLocal('req_appid', ''),
          'uri': utils.getFromLocal('req_uri', ''),
          'method': utils.getFromLocal('req_method', 'GET'),
          'body': utils.getFromLocal('req_body', '')
        },
        res: {
          'body': ''
        },
        conf: {
          'privateKey': utils.getFromLocal('privateKey', '')
        }
      }
    },
    methods: {
      // 加载所有模版文件
      loadAll () {
        var files = utils.scanDir([], 'templates')
        utils.llog('文件是：' + JSON.stringify(files))
        return files
      },
      handleSearch (queryString) {
        var apis = this.req.apis
        var results = queryString ? apis.filter(this.createFilter(queryString)) : apis
        this.req.showApis = results
      },
      // 过滤方法
      createFilter (queryString) {
        return (api) => {
          return (api.value.indexOf(queryString.toLowerCase()) >= 0)
        }
      },
      /**
       * 发送请求
       */
      sendMsg () {
        // 检查信息密钥是否配置
        let pk = this.conf.privateKey
        if (!pk) {
          this.$Notice.error({
            title: '请到设置中配置信息密钥'
          });
          return
        }
        // 检查appid是否填写
        if (!this.req.appid) {
          this.$Notice.error({
            title: '请填写appid'
          });
          return
        }

        let opt = this.getOpt()

        this.$Notice.info({
          title: '发送请求中...'
        });

        let _this = this
        // 发送请求
        request(opt, function(error, response, body) {
          _this.$Notice.success({
            title: '成功返回信息',
            desc: response && response.statusCode
          })
          if (!!error) {
            _this.$Notice.error({
              title: '错误信息',
              desc: error
            })
          }
          let respMsg
          if (response && response.statusCode === 200) {
            utils.llog("成功响应:"+ body)
            // 特殊响应的处理
            var resMsg = JSON.stringify((JSON.parse(body)).message)
            var decMsg = new Buffer(resMsg, 'base64').toString()
            respMsg = JSON.parse(decMsg)
            _this.res.body = JSON.stringify(respMsg, null, 2)

            // 保存到历史记录
            let hisData = {}
            hisData.appid = _this.req.appid
            hisData.uri = _this.req.uri
            hisData.method = _this.req.method
            hisData.body = _this.req.body
            hisData.response = respMsg
            utils.saveHistory(JSON.stringify(hisData, null, 2))
          } else {
            utils.llog("失败响应:" + error)
            _this.res.body = error
          }
          // 保存请求信息
          _this.saveReq()
        })
      },
      /**
       * 获取 opt 对象
       */
      getOpt: function () {
        // 请求头信息
        var method = this.req.method
        var uri = this.req.uri
        var body = this.req.body
        var appid = this.req.appid

        // application/x-www-form-urlencoded
        var contentType = 'application/json;charset=utf-8'
        var opt = {
          method: method,
          uri: uri,
          headers: {
            'Content-Type': contentType
          }
        }

        // GET 请求
        if (method === 'GET') {
          opt.qs = this.getBody(appid, body)
        } else {
          // 其他请求
          opt.body = JSON.stringify(this.getBody(appid, body))
        }
        utils.llog('请求为:' + JSON.stringify(opt))
        return opt
      },
      /**
       * 获取请求体
       */
      getBody: function (appid, body) {
        var message = utils.base64(this.getMessage(body))
        var signature = utils.sign(appid + message, this.conf.privateKey)
        return {
          message: message,
          signature: signature
        }
      },
      /**
       * 组装message,拼装上必须信息
       */
      getMessage: function (body) {
        if (!body) {
          body = {}
        } else {
          body = JSON.parse(body)
        }

        body['timestamp'] = moment().format('YYYY-MM-DD HH:mm:ss')
        body['nonce'] = '123456'
        body['ex_serial_no'] = Date.parse(new Date())
        return body
      },
      // 保存请求参数信息
      saveReq: function () {
        localStorage.setItem('req_uri', this.req.uri)
        localStorage.setItem('req_appid', this.req.appid)
        localStorage.setItem('req_method', this.req.method)
        localStorage.setItem('req_body', this.req.body)
      },
      // 选择操作
      handleSelect (item) {
        utils.llog('加载文件路径：' + item)
        // 读取文件
        var fileData = fs.readFileSync(item)
        // 解析文件
        var reqData = JSON.parse(fileData)
        if (!reqData) {
          utils.llog('文件：' + name + '无内容或JSON格式不正确')
          return
        }
        this.req.method = reqData.method
        this.req.uri = reqData.uri
        this.req.appid = reqData.appid
        this.req.body = JSON.stringify(reqData.body, null, 2)
        // 清除响应内容
        this.res.body = ''
      }
    }
  }
</script>

