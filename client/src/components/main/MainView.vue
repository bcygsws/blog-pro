<!--
*@name: MainView.vue
*@author: Bao Chengyi
*@date: 2024/7/24 21:22
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
      :handleSearch="handleSearch"
  />

</template>
<script lang="ts" setup>
import FrontItem from "@/components/item/FrontItem.vue";
import {onMounted, ref, watchEffect} from "vue";
import {_getArtAPI, IList, IPage} from "@/apis/article";
import {_getCatAPI, ICategory} from "@/apis/category";
import {useRouter} from "vue-router";
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import HeaderItem from "@/components/item/HeaderItem.vue";

const router = useRouter();
const {message} = useDiscreteAPI();
import {useRoute} from 'vue-router';

const route = useRoute();
console.log("testx", route.path);

const value_selected = ref('')
console.log(value_selected);

interface ILabel {
  label: string;
  value: string;
}

// 存储分类的数组catList
const catList = ref<ICategory[]>([]);
// 弹出下拉框的配置项
let options: ILabel[] = [];
// 定义变量存储路由参数
const routeArg = ref<ICategory>({id: 0, name: ""});
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

const pageInfo = ref<IPage>({
  categoryId: 0,
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
    // 只讲limit分页时的offset值，归零；让关键字查询，从返回的数据表中第一条开始
    pageInfo.value.page = 1;
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

const valueChanged = (val: string) => {
  // console.log(typeof val);
  console.log(val);
  // console.log(value_selected.value);
// 根据val值，也即artList中的name值，查找分类id
  catList.value.some((item: ICategory) => {
    if (item.name === val) {
      routeArg.value.id = item.id;
      routeArg.value.name = item.name;
      return true;
    }
  });
  router.push({path: `/category/${routeArg.value.id}`, query: {name: `${routeArg.value.name}`}});


}


</script>

<style lang="scss" scoped>

</style>