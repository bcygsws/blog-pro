<!--
*@name: ManageArt
*@author: Bao Chengyi
*@date: 2024/7/25 22:15
-->
<template>
  <div class="art-container">
    <!--justify-content flex布局下的，主轴的排列方式-->
    <n-tabs
        type="line"
        animated j
        ustify-content="space-evenly"
        :on-update:value="handleTabsChange"
        ref="tabsInstRef"
        v-model:value="tab_value"
    >
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
                    <n-button type="info" size="small" @click="changeHandler(item.id)">修改</n-button>
                    <n-button type="error" size="small" @click="delHandler(item.id)">删除</n-button>
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
        <div class="add-art">
          <ArtFormItem
              ref="myRef"
              :model="model"
              :handleValidateClick="handleValidateClick"
              :name="btnName"
          >

          </ArtFormItem>
        </div>
      </n-tab-pane>
      <n-tab-pane name="edit" tab="修改文章">
        <div class="add-art">
          <ArtFormItem
              ref="myRef"
              :model="model_change"
              :handleValidateClick="handleValidateClick"
              :generalOptions="generalOptions"
              :name="btnName"
          >
          </ArtFormItem>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script lang="ts" setup>
import {nextTick, onMounted, Ref, ref} from "vue";
import {addArtAPI, delArtByIdAPI, getArtAPI, getArtByIdAPI, IList, IPage} from "@/apis/article";
import {timeFormat} from "@/utils/timeFormat";
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import {getCatAPI, ICategory} from "@/apis/category";
import ArtFormItem from "@/components/manage/ArtFormItem.vue";
import {TabsInst} from "naive-ui";

const {message} = useDiscreteAPI();
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

// 添加列表时，表单数据对象model
interface IModel {
  categoryId: string | null;
  title: string;
  content: string;
}

const model = ref<IModel>({
  title: '',
  content: '',
  categoryId: null
});
// 修改列表时，表单数据对象
const model_change = ref<IModel>({
  title: '',
  content: '',
  categoryId: null
});
// 分类列表catList
const catList = ref<ICategory[]>([]);

interface IOptions {
  label: string;
  value: string;
}

const generalOptions = ref<IOptions[]>([]);
// 用于从子组件属性中，获取ArtForm暴露给父组件的DOM对象
const myRef = ref(null);
// 维护一个状态，0：表示添加，1：表示修改
const btnName = ref('');
// 获取tabs对象
const tabsInstRef = ref<TabsInst | null>(null);
const tab_value = ref('list');

const getArtList = async (val: Ref<IPage>) => {
  const res = await getArtAPI(val.value);
  console.log(res);
  if (res.data.code === 200) {// 请求列表成功
    count.value = res.data.data?.count;
    console.log(count.value);
    artList.value = res.data.data?.list;
  }

}
/**
 * @name:getCatList
 * @description:获取分类
 *
 * */
const getCatList = async () => {
  // 拿到最新的分类值
  const res = await getCatAPI();
  if (res.data.code === 200) {// 分类列表查询操作成功了
    catList.value = res.data.data!;
    generalOptions.value = catList.value.map((v: ICategory) => ({
      label: v.name,
      value: v.id.toString()
    }));
  }
}
onMounted(() => {
  console.log("mytses", myRef.value);
  getArtList(pageInfo);// 传入一个ref对象
  getCatList();
});
const pageChange = (val: number) => {
  console.log(val);
  pageInfo.value.page = val;
  console.log("test", pageInfo.value.page);
  // 重新请求一下数据列表
  getArtList(pageInfo);// 传入一个ref对象

}
const pageSizeChange = (val: number) => {
  console.log(val);
  pageInfo.value.pageSize = val;
  getArtList(pageInfo);// 传入一个ref对象
}
/**
 * @name:delHandler
 * @description:根据id删除当前记录
 *
 * */
const delHandler = async (id: number) => {
  const res = await delArtByIdAPI(id);
  if (res.data.code === 200) {
    message.success(res.data.message);
    await getArtList(pageInfo);// 传入一个ref对象

  }
}
/**
 * @点击按钮，添加文章列表
 *
 * */
const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  console.log("我执行了吗？1");
  console.log(myRef.value);
  console.log(myRef.value.sonRef);
  // console.log(myRef.value.sonRef);
  myRef.value.sonRef.validate(async (errors) => {
    console.log("我执行了吗？2");
    if (!errors) {
      console.log(model.value);
      const res = await addArtAPI(model.value);
      if (res.data.code === 200) {
        // 成功提示
        message.success('添加成功');
        // 更新文章列表
        await getArtList(pageInfo);

      }

    } else {
      console.log(errors);
      message.error('验证失败');
    }
  })
}
/**
 * @name:handleTabsChange
 * @description:tab标签页发生改变时
 * 该方法参数是，当前tab的name值
 *
 * */
const handleTabsChange = (val: string) => {
  console.log(val);
  btnName.value = val;
}
/**
 * @name:changeHandler
 * @description:博客文章列表中，点击"修改"按钮时逻辑
 * 参数id:文章列表项的id值，number
 * */
const changeHandler = async (id: number) => {
  console.log(id);
  // 根据id查询数据，回显到表单中
  const res = await getArtByIdAPI(id);
  if (res.data.code === 200) {
    const {category_id, title, content} = res.data.data!;
    model_change.value.categoryId = category_id.toString();
    model_change.value.title = title;
    model_change.value.content = content;

  }
  // 切换滚动条
  // 2.1 tab标签值改变
  tab_value.value = "edit";
  // 2.2 滚动条同步改变
  await nextTick(() => tabsInstRef.value?.syncBarPosition());

}
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