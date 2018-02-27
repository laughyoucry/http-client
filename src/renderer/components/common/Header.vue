<template>
  <div class="header">
    <div class="logo">
      HTTP请求客户端
      <span>版本:{{ appVersion }}</span>
    </div>
    <div class="user-info">
      <Button type="primary" shape="circle" icon="gear-a" @click="handleClick">设置</Button>
    </div>
    <Modal
        v-model="showModal"
        title="设置"
        width="600">
        <setting></setting>
    </Modal>
  </div>
</template>
<script>
  import { remote } from 'electron'
  import os from 'os'
  import setting from '../pages/Setting'

  export default {
    components: {
      setting
    },
    data () {
      return {
        platform: os.platform,
        appVersion: '2.0.0',
        showModal: false
      }
    },
    methods: {
      handleClick: function() {
        console.log("click the icon")
        this.showModal = true
      }
    }
  }
</script>
<style>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
    background-color: #1c272b;
  }
  .header .logo{
    float: left;
    width:300px;
    text-align: center;
  }
  .header .logo span{
    font-size: 12px;
    background-color: #f26b3a;
  }
  .user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
  }
</style>


