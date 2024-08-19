<!--
*@name: FrontItem.vue
*@author: Bao Chengyi
*@date: 2024/8/06 01:20
-->
<template>
  <div class="n-view">
    <n-input-group>
      <n-input v-model:value="pageInfo.keywords" :style="{ width: '35%' }" placeholder="请输入检索关键字"/>
      <n-button type="primary" @click="handleSearch">
        搜索
      </n-button>
    </n-input-group>
    <div class="art-list">
      <!--list列表-->
      <div class="list">
        <!--bordered值为false,去掉边框；hoverable卡片悬浮效果-->
        <n-card
            :title="titleIcon(item.title)"
            v-for="item in artList"
            :key="item.id"
            header-style="font-size:16px"
            content-style="font-size:18px"
            footer-style="font-size:16px"
            @click="navToDetail(item.id)"
            :bordered="false"
        >
          {{ item.content }}
          <template #footer>
            发布时间：{{ timeFormat(item['create_time']) }}
          </template>
        </n-card>
      </div>
    </div>
    <div class="page">
      <n-pagination
          v-model:page="pageInfo.page"
          v-model:page-size="pageInfo.pageSize"
          :item-count="total"
          show-size-picker
          :page-sizes="[4,5,10,20,40]"
          @update:page="pageChange"
          @update:page-size="pageSizeChange"

      />
    </div>
  </div>

</template>
<script lang="ts" setup>
import {timeFormat} from "@/utils/timeFormat";
import {IList} from "@/apis/article";
import {useRouter} from "vue-router";
import {Diamond} from '@vicons/tabler';
// 控制icon图标的样式，如：size color和以何种标签渲染的tag等等
import {Icon} from '@vicons/utils';
import {h} from "vue";
import {NButton} from "naive-ui";

const router = useRouter();
defineProps({
  pageInfo: {
    type: Object,
    required: true
  },
  artList: {
    type: Array<IList>,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pageChange: {
    type: Function,
    required: true
  },
  pageSizeChange: {
    type: Function,
    required: true
  },
  handleSearch: {
    type: Function,
    required: true
  }
});

// console.log("mytest2", props.pageInfo);
/**
 * @name:navToDetail
 * @description:文章列表 点击后，导航至详情页
 *
 *
 * */
const navToDetail = (id: number) => {
  // console.log(typeof id);
  router.push(`/detail/${id}`);
}
/**
 * @description:使用render和h函数，渲染创建的节点
 *
 * */
const titleIcon = (text: string) => {
  // 返回一个render函数，匹配title的类型
  return () => {
    return h('div', {style: {display: 'flex', flexDirection: 'row', alignItems: 'center'}}, {
      default: () => [
        h(Icon, {color: '#18A058', size: '20px'}, {
          default: () => h(Diamond, null)
        }),
        h('span', {style: {paddingLeft: '5px', fontWeight: 700}}, `${text}`)]
    });
  }
}
</script>

<style lang="scss" scoped>
.n-view {
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 100%;
  padding: 15px 0;
  box-sizing: border-box;

  .n-input-group {
    justify-content: center;
  }

  .art-list {
    position: absolute;
    top: 64px;
    bottom: 50px;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    .list {
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      /*消除card的margin-top塌陷*/
      overflow: hidden;
    }

    .n-card {
      min-height: 162px;
    }


  }

  .page {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  //.card-head {
  //  font-size: 14px;
  //}

}

</style>