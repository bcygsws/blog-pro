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
          <n-card :title="item.title" header-style="font-size:14px" v-for="item in artList" :key="item.id">
            <div class="main">
              {{ item.content }}
            </div>
            <template #footer>
              <div class="box">
                <div class="time">发布时间：{{ timeFormat(item.create_time) }}</div>
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
            <!--item-count总页数-->
            <n-pagination
                v-model:page="pageInfo.page"
                v-model:page-size="pageInfo.pageSize"
                :item-count="count"
                show-size-picker
                :page-sizes="[4,5,10,20,40]"
                :on-update:page="pageChange"
                :on-update:page-size="pageSizeChange"

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
import {defineComponent, onMounted, Ref, ref} from "vue";
import {getArtAPI, IList, IPage} from "@/apis/article.ts";
import {timeFormat} from "@/utils/timeFormat.ts";

export default defineComponent({
  methods: {timeFormat},
  setup() {
    const pageInfo = ref<IPage>({
      categoryId: 0,
      page: 1,
      pageSize: 4,
      keywords: ''
    });
    // 博客文章总记录数
    const count = ref<number | undefined>(0);
    // 博客文章列表
    const artList = ref<IList[] | undefined>([]);
    const getArtList = async (val: Ref<IPage>) => {
      const res = await getArtAPI(val.value);
      console.log(res);
      if (res.data.code === 200) {// 请求列表成功
        count.value = res.data.data?.count;
        console.log(count.value);
        artList.value = res.data.data?.list;
      }

    }
    onMounted(() => {
      getArtList(pageInfo);
    });
    const pageChange = (val: number) => {
      console.log(val);
      pageInfo.value.page = val;
      console.log("test", pageInfo.value.page);
      // 重新请求一下数据列表
      getArtList(pageInfo);

    }
    const pageSizeChange = (val: number) => {
      console.log(val);
      pageInfo.value.pageSize = val;
      getArtList(pageInfo);
    }
    return {
      pageInfo,
      count,// 文章列表数量
      artList,// 文章列表
      pageChange,// 当前页码改变
      pageSizeChange// 当前页面容量改变
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
        font-size: 13px;
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