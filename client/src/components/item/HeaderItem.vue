<!--
*@name: Footer
*@author: Bao Chengyi
*@date: 2024/8/7 3:48
-->
<template>
  <div class="header">
    <router-link to="/main" active-class="active"><span class="icon-home"><span>首页</span></span></router-link>
    <router-link
        :to="{path:'/category/'+routeArg.id,query:{name:routeArg.name}}"
        active-class="active">
      <n-popselect
          v-model="route.query.name"
          :options="options"
          trigger="click"
          @update:value="valueChanged"
      >
        <span>分类<span class="sp">{{ route.query.name }}</span></span>
      </n-popselect>
    </router-link>
    <router-link to="/login" active-class="active">后台管理</router-link>
  </div>
</template>
<script lang="ts" setup>
import {ILabel} from "@/apis/shared";
import {useRoute} from "vue-router";
import {watchEffect} from "vue";

const route = useRoute();

const props = defineProps({
  options: {
    type: Array<ILabel>,
    required: true
  },
  valueChanged: {
    type: Function,
    required: true
  },
  routeArg: {
    type: Object,
    required: true
  },
});
console.log(props.options);
console.log("mytest", props.routeArg.id);
/**
 * @刷新页面，value_selected值恢复为0
 *
 * */
watchEffect(() => {
  const str = route;
  const str1 = route.path;
  console.log(str);
  console.log(str1);
})

</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: row nowrap;
  height: 50px;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 30px;
  background-color: #F4F5F5;

  a {
    font-size: 16px;
    text-decoration: none;
    width: 130px;
    color: #666666;

    .icon-home {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: flex-start;

      &::before {
        content: "";
        display: block;
        width: 30px;
        height: 30px;
        background-image: url("@/assets/vue.svg");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        margin-right: 10px;
      }
    }

    span {
      span.sp {
        font-size: 12px;
      }
    }

    &:hover {
      color: coral;
    }
  }

  .active {
    color: dodgerblue;
  }
}

</style>