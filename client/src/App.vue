<template>
  <div class="app-container">
    <!--一级路由：HomeView和Login占位符-->
    <!--国际化：分页或者日期选择器等，显示中文-->
    <n-config-provider :locale="zhCN" :data-locale="dateZhCN">
      <router-view></router-view>
    </n-config-provider>
  </div>
</template>
<script lang="ts" setup>
import {zhCN, dateZhCN} from 'naive-ui';
</script>

<style lang="scss" scoped>
.app-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>