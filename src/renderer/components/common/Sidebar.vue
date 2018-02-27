<template>
  <div class="sidebar">
    <Tabs value="name1">
      <TabPane label="历史" name="historys" icon="ios-timer">
        <Menu @on-select="handleMenuSelect">
          <Submenu v-for="item in historyFiles" :name="item.name">
            <template slot="title">
              <Icon type="ios-paper"></Icon>
              {{ item.name }}
            </template>
            <MenuItem v-for="req in item.files" :name="req.name" style="padding-left: 16px;font-size:12px;">
              <!-- <Button type="primary" size="small" @click="collection(req)"
                style="height:14px;line-height: 14px;margin-left: 4px;padding: 1px 2px;font-size: 10px;">
                + 收藏
              </Button> -->
              <Tag 
                :color="calcColor(req.method)"
                style="height:12px;line-height: 12px;margin-left: 4px;padding: 0 2px;font-size: 8px;">
                {{ req.method }}
              </Tag>
              {{ req.name }}
            </MenuItem>
          </Submenu>
        </Menu>
      </TabPane>
    </Tabs>
    <input type="hidden" v-model="historyCount"></input>
  </div>
</template>
<script>
import utils from '@/libs/Utils'

export default {
  data() {
    return {
      historyFiles: this.$store.state.app.historyFiles
    }
  },
  methods: {
    onRoutes(name) {
      this.$router.replace({
        name: name
      });
    },
    calcColor: function(method) {
      if (!method) {
        return ''
      }
      if (method == 'GET') {
        return 'blue'
      }
      if (method == 'POST') {
        return 'green'
      }
      if (method == 'PUT') {
        return 'yellow'
      }
      if (method == 'DELETE') {
        return 'red'
      }
    },
    collection: function(request) {
      // 读取文件

      // 保存到收藏文件夹下
      // let req = {
      //   appid: '123' + this.$store.state.Counter.main,
      //   uri: 'http://123.com',
      //   method: 'PUT',
      //   body: '呵呵额'
      // }
    },
    handleMenuSelect: function(name) {
      let fileData = utils.getFileDataByName(this.historyFiles, name)
      if (!!fileData && !!fileData.filePath) {
        let data = utils.readFile(fileData.filePath, true)
        this.$store.commit('setReq', data.data)
        this.$store.commit('setRes', {
          body: data.data.response
        })
      }
    }
  },
  computed: {
    historyCount() {
      let result = this.$store.state.Counter.operToHis
      console.log("history 结果为：" + result)
      this.historyFiles = this.$store.state.app.historyFiles
      return result
    }
  }
};
</script>

<style>
.sidebar {
  display: block;
  position: absolute;
  width: 260px;
  overflow-y: scroll;
  left: 0;
  top: 70px;
  bottom: 0;
  background: rgb(244, 247, 250);
}
.sidebar > ul {
  height: 100%;
}
</style>
