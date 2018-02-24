<template>
  <Form ref="confData">
    <FormItem label="信息密钥">
      <Input 
        v-model="conf.privateKey" 
        type="textarea" 
        :autosize="{minRows: 16,maxRows: 16}" 
        placeholder="请输入密钥"
        style="font-family:monospace;"
        @on-blur="handleSubmit"
        >
      </Input>
    </FormItem>
  </Form>
</template>
<script>
import utils from '@/libs/Utils'

export default {
  data() {
    return {
      conf: {
        privateKey: utils.getFromLocal('privateKey', '')
      }
    }
  },
  methods: {
    handleSubmit() {
      if (this.conf.privateKey != utils.getFromLocal('privateKey', '')) {
        utils.llog("设置密钥为:" + this.conf.privateKey)
        localStorage.setItem('privateKey', this.conf.privateKey)
      }
    }
  }
}
</script>