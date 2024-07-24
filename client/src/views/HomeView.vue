<!--
*@name: HomeView.vue
*@author: Bao Chengyi
*@date: 2024/7/24 21:18
-->
<template>
  <div class="home-container">
    <div class="header">
      <router-link to="/main">首页</router-link>
      <router-link to="/category">列表</router-link>
      <router-link to="/login">后台</router-link>
    </div>
    <div class="content">
      <!--组件占位符-->
      <router-view></router-view>
    </div>

  </div>
</template>
<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.home-container {
  .header {
    display: flex;
    flex-flow: row nowrap;
    height: 50px;
    align-items: center;
    background-color: #eeeeee;
    box-sizing: border-box;
    padding: 10px 30px;

    a {
      font-size: 22px;
      text-decoration: none;
      margin-right: 50px;
      color: #666666;

      &:hover {
        color: coral;
      }
    }
  }
}

</style>