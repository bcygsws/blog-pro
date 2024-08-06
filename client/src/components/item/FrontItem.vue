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
        <n-card
            :title="item.title"
            v-for="item in artList"
            :key="item.id"
            header-style="font-size:14px"
            content-style="font-size:16px"
            footer-style="font-size:14px"
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

const props = defineProps({
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

console.log(props.pageInfo);

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

  .card-head {
    font-size: 14px;
  }

}

</style>