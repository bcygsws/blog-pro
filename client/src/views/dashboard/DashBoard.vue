<!--
*@name: DashBoard
*@author: Bao Chengyi
*@date: 2024/7/25 20:57
-->
<!--登录成功后的静态结构-->
<template>
  <div class="dash-container">
    <n-layout style="height: 100vh">
      <n-layout-header style="height: 64px; padding: 24px;background-color:#eeeeee" bordered>

      </n-layout-header>
      <n-layout position="absolute" style="top: 64px; bottom: 0" has-sider>
        <n-layout-sider
            content-style="padding: 24px"
            :native-scrollbar="false"
            width="250"
            bordered
        >
          <div class="slider">
            <router-link to="/dashboard/manage_art" active-class="active">文章管理</router-link>
            <router-link to="/dashboard/manage_cat" active-class="active">分类管理</router-link>
            <router-link to="/login">退出</router-link>
          </div>

        </n-layout-sider>
        <n-layout content-style="padding: 24px;" :native-scrollbar="false">
          <div class="content">
            <router-view/>
          </div>
        </n-layout>
      </n-layout>
    </n-layout>
    <!--水印-->
    <div class="mark">后台管理系统</div>
  </div>

</template>
<script lang="ts">

</script>

<style lang="scss" scoped>
.dash-container {
  .slider {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    a {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-decoration: none;
      color: #666666;
      text-align: center;
      border-radius: 5px;

      &:hover {
        color: orangered;
      }
    }

    a.active {
      background-color: $info;
      color: #ffffff;
    }
  }

  .mark {
    font-size: 64px;
  }
}

</style>