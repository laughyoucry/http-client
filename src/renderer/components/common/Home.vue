<template>
  <div class="wrapper">
    <v-header></v-header>
    <v-sidebar></v-sidebar>
    <div class="content">
        <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import vHeader from './Header.vue'
  import vSidebar from './Sidebar.vue'

  export default {
    components: {
      vHeader, vSidebar
    }
  }
</script>
<style>
  .content {
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 240px;
    right: 0;
    top: 70px;
    bottom:0;
    width: auto; 
    padding:20px;
    box-sizing: border-box;
    overflow-y: scroll;
    z-index: 1;
    transition: left .3s;
  }
</style>