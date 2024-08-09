<!--
*@name: CategoryView
*@author: Bao Chengyi
*@date: 2024/7/24 21:45
-->
<template>
  <HeaderItem
      :options="options"
      :valueChanged="valueChanged"
      :routeArg="routeArg"
  />
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
import {onMounted, ref, watch, watchEffect} from "vue";
import {_getArtAPI, IList, IPage} from "@/apis/article";
import {_getCatAPI, ICategory} from "@/apis/category";
import {useRoute, useRouter} from "vue-router";
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import HeaderItem from "@/components/item/HeaderItem.vue";

const router = useRouter();
const route = useRoute();
const {message} = useDiscreteAPI();

interface ILabel {
  label: string;
  value: string;
}

// 存储分类的数组catList
const catList = ref<ICategory[]>([]);
// 弹出下拉框的配置项
let options: ILabel[] = [];

// 定义变量存储路由参数
// 为route.params.id插入类型断言，消除警告提示；两种方式：1. <string>route.params.id 2.route.params.id as string
const routeArg = ref<ICategory>({id: parseInt(route.params.id as string), name: ""});
// 获取分类id
const getCatList = async () => {
  const res = await _getCatAPI();
  console.log(res);
  if (res.data.code === 200) {
    catList.value = res.data.data!;
    options = catList.value.map(item => ({
      label: item.name,
      value: item.name

    }));
  } else {
    // 获取分类失败
    message.error(res.data.message);
  }
}
// 分类id,从路由参数中拿到值，保持页面刷新时，还是请求该分类下的文章列表
const pageInfo = ref<IPage>({
  categoryId: parseInt(<string>route.params.id),
  page: 1,
  pageSize: 4,
  keywords: ''
});
// 博客文章总记录数
const total = ref(0);
// 定义数组，存储文章列表
const artList = ref<IList[]>([]);

/**
 * @name:getArtList
 * @description:获取文章列表
 *
 * */
const getArtList = async (val: IPage) => {
  const res = await _getArtAPI(val);
  console.log(res.data);
  if (res.data.code === 200) {
    const {count, list} = res.data.data;
    total.value = count;
    artList.value = list;


  }

}
onMounted(() => {
  getCatList();
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
    // limit 的offset值，归0，从查询到的数据表，第一条开始检索
    pageInfo.value.page = 1;
    getArtList(pageInfo.value);
  }
});
/**
 * @name:watchEffect
 * @description:当分类id切换时，重新请求文章列表数据
 *
 * */
watch(() => pageInfo.value.categoryId, (val: any) => {
  console.log(typeof val);
  getArtList({...pageInfo.value, categoryId: val});

}, {immediate: true});

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

const valueChanged = (val: string) => {
  // console.log(typeof val);
  console.log(val);
  // console.log(value_selected.value);
// 根据val值，也即artList中的name值，查找分类id
  catList.value.some((item: ICategory) => {
    if (item.name === val) {
      routeArg.value.id = item.id;
      routeArg.value.name = item.name;
      // 分类切换时，categoryId的变化，驱动重新请求数据
      pageInfo.value.categoryId = item.id;
      return true;
    }
  });
  router.push({path: `/category/${routeArg.value.id}`, query: {name: `${routeArg.value.name}`}});


}
</script>

<style lang="scss" scoped>

</style>