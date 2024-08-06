<!--
*@name: HomeView.vue
*@author: Bao Chengyi
*@date: 2024/7/24 21:18
-->
<template>
  <div class="home-container">
    <div class="content">
      <!--组件占位符-->
      <router-view></router-view>
    </div>
    <!--footer没有数据，和子路由组件的数据交互，保留在当前结构中-->
    <div class="footer">
      <div class="top">Powered by Bao Chengyi</div>
      <div class="bottom">XICP备xxxx号-1</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.home-container {
  width: 1500px;
  margin: 0 auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;


  .content {
    position: absolute;
    top: 0;
    bottom: 50px;
    left: 0;
    right: 0;
    //background-color: pink;
  }

  .footer {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    background-color: #F4F5F5;

    .top {
      font-size: 16px;
    }
  }
}

</style>