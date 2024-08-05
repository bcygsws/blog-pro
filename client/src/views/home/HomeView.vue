<!--
*@name: HomeView.vue
*@author: Bao Chengyi
*@date: 2024/7/24 21:18
-->
<template>
  <div class="home-container">
    <div class="header">
      <router-link to="/main" active-class="active">首页</router-link>
      <router-link to="/category" active-class="active">分类</router-link>
      <router-link to="/login" active-class="active">后台</router-link>
    </div>
    <div class="content">
      <!--组件占位符-->
      <router-view></router-view>
    </div>
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

  .header {
    display: flex;
    flex-flow: row nowrap;
    height: 50px;
    align-items: center;
    box-sizing: border-box;
    padding: 10px 30px;
    background-color: #eeeeee;

    a {
      font-size: 22px;
      text-decoration: none;
      margin-right: 50px;
      color: #666666;

      &:hover {
        color: coral;
      }
    }

    .active {
      color: dodgerblue;
    }
  }

  .content {
    position: absolute;
    top: 50px;
    bottom: 50px;
    left: 0;
    right: 0;
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
    background-color: #eeeeee;

    .top {
      font-size: 16px;
    }
  }
}

</style>