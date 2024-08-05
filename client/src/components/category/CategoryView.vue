<!--
*@name: CategoryView
*@author: Bao Chengyi
*@date: 2024/7/24 21:45
-->
<template>
  <FrontItem
      :pageInfo="pageInfo"
      :artList="artList"
      :total="total"
      :pageChange="pageChange"
      :pageSizeChange="pageSizeChange"
      :handleSearch="handleSearch"/>
</template>
<script lang="ts" setup>

import FrontItem from "@/components/item/FrontItem.vue";
import {onMounted, ref, watchEffect} from "vue";
import {getArtAPI, IList, IPage} from "@/apis/article";

const pageInfo = ref<IPage>({
  categoryId: 0,
  page: 1,
  pageSize: 4,
  keywords: ''
});
// 博客文章总记录数
const total = ref(0);
// 定义数组，存储文章列表
const artList = ref<IList[] | undefined>([]);

/**
 * @name:getArtList
 * @description:获取文章列表
 *
 * */
const getArtList = async (val: IPage) => {
  const res = await getArtAPI(val);
  console.log(res.data);
  if (res.data.code === 200) {
    const {count, list} = res.data.data;
    total.value = count;
    artList.value = list;


  }

}
onMounted(() => {
  getArtList(pageInfo.value);
});
/**
 * @name:watchEffect
 * @description:监听钩子，在total=0时，表示没有查询到相关数据
 * 此时，pageInfo置为最初值后，重新请求列表
 *
 * 如果：total>0；但数组list为空；此时，是因为limit中offset过大，导致
 * 查询不到数据，此时应该予以纠正
 *
 *
 * */
watchEffect(() => {
  if (total.value && !artList.value?.length) {
    pageInfo.value.page = 1;
    pageInfo.value.categoryId = 0;
    getArtList(pageInfo.value);
  }
});

const pageChange = (val: number) => {
  console.log(val);
  pageInfo.value.page = val;
  getArtList(pageInfo.value);

}
const pageSizeChange = (val: number) => {
  console.log(val);
  pageInfo.value.pageSize = val;
  getArtList(pageInfo.value);

}
/**
 * @name:handleSearch
 * @description:处理关键字检索，按钮的点击事件
 *
 * */
const handleSearch = () => {
  console.log(pageInfo.value);
  getArtList(pageInfo.value);
}
</script>

<style lang="scss" scoped>

</style>