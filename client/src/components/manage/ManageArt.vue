<!--
*@name: ManageArt
*@author: Bao Chengyi
*@date: 2024/7/25 22:15
-->
<template>
  <div class="art-container">
    <!--justify-content flex布局下的，主轴的排列方式-->
    <n-tabs type="line" animated justify-content="space-evenly">
      <n-tab-pane name="list" tab="文章列表">
        <div class="list">
          <n-card title="hello world">
            <div class="main">
              一身转战三千里，一剑曾当百万师
            </div>
            <template #footer>
              <div class="box">
                <div class="time">发布时间：{{ '2024-10-12 12:02:01' }}</div>
                <div class="action">
                  <n-space>
                    <n-button type="info" size="small">修改</n-button>
                    <n-button type="error" size="small">删除</n-button>
                  </n-space>
                </div>
              </div>
            </template>
          </n-card>
          <div class="page">
            <n-pagination
                v-model:page="pageInfo.page"
                v-model:page-size="pageInfo.pageSize"
                :page-count="100"
                show-size-picker
                :page-sizes="[5,10,20,40,100]"
            />
          </div>
        </div>

      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        添加文章
      </n-tab-pane>
      <n-tab-pane name="edit" tab="修改文章">
        修改文章
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  setup() {
    const pageInfo = ref<any>({
      page: 1,
      pageSize: 5
    });
    return {
      pageInfo
    }
  }

});
</script>

<style lang="scss" scoped>
.art-container {
  .list {
    .main {
      font-size: 16px;
    }


    .box {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      .time {
        font-size: 12px;
        margin-right: 15px;
      }
    }

    .page {
      padding: 5px;
      margin: 5px 0;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>