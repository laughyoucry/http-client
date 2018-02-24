<template>
    <div class="sidebar">
        <Tabs value="name1">
            <TabPane label="历史" name="historys" icon="ios-timer">
                <Menu>
                    <Submenu v-for="item in hisItems" :name="item.name">
                        <template slot="title">
                            <Icon type="ios-paper"></Icon>
                            {{ item.day }}
                        </template>
                        <MenuItem v-for="req in item.reqs" :name="req.id" style="padding-left: 16px;font-size:12px;">
                            {{ req.name }}
                            <Tag v-if="req.method == 'GET'" color="blue" style="height:12px;line-height: 12px;margin-left: 4px;padding: 0 2px;font-size: 8px;">GET</Tag>
                            <Tag v-if="req.method == 'POST'" color="green" style="height:12px;line-height: 12px;margin-left: 4px;padding: 0 2px;font-size: 8px;">POST</Tag>
                            <Tag v-if="req.method == 'PUT'" color="yellow" style="height:12px;line-height: 12px;margin-left: 4px;padding: 0 2px;font-size: 8px;">PUT</Tag>
                            <Tag v-if="req.method == 'DELETE'" color="red" style="height:12px;line-height: 12px;margin-left: 4px;padding: 0 2px;font-size: 8px;">DELETE</Tag>
                        </MenuItem>
                    </Submenu>
                </Menu>
            </TabPane>
            <TabPane label="收藏" name="collections" icon="android-favorite">
                <Menu>
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-paper"></Icon>
                            内容管理
                        </template>
                        <MenuItem name="1-1">文章管理</MenuItem>
                        <MenuItem name="1-2">评论管理</MenuItem>
                        <MenuItem name="1-3">举报管理</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-people"></Icon>
                            用户管理
                        </template>
                        <MenuItem name="2-1">新增用户</MenuItem>
                        <MenuItem name="2-2">活跃用户</MenuItem>
                    </Submenu>
                    <Submenu name="3">
                        <template slot="title">
                            <Icon type="stats-bars"></Icon>
                            统计分析
                        </template>
                        <MenuGroup title="使用">
                            <MenuItem name="3-1">新增和启动</MenuItem>
                            <MenuItem name="3-2">活跃分析</MenuItem>
                            <MenuItem name="3-3">时段分析</MenuItem>
                        </MenuGroup>
                        <MenuGroup title="留存">
                            <MenuItem name="3-4">用户留存</MenuItem>
                            <MenuItem name="3-5">流失用户</MenuItem>
                        </MenuGroup>
                    </Submenu>
                </Menu>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
export default {
  data() {
    return {
        hisItems: [{
            name: "2018-02-23",
            day: "2018-02-23",
            reqs: [{
                id: "代充值1",
                name: "6.16 个人管理-开户与查询-查询",
                method: "GET"
            },
            {
                id: "代充值2",
                name: "6.16 个人管理-开户与查询-查询",
                method: "POST"
            },
            {
                id: "代充值3",
                name: "6.16 个人管理-开户与查询-查询6.16 个人管理-开户与查询-查询",
                method: "PUT"
            },
            {
                id: "代充值4",
                name: "6.16 个人管理-开户与查询-查询",
                method: "DELETE"
            }]
        }]
    };
  },
  methods: {
    onRoutes(name) {
      this.$router.replace({
        name: name
      });
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
  background:rgb(244, 247, 250);
}
.sidebar > ul {
  height: 100%;
}
</style>
