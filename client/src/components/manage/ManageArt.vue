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
          <n-form
              ref="formRef"
              :model="model"
              :rules="rules"
              label-placement="left"
              label-width="auto"
              require-mark-placement="right-hanging"
              :size="'small'"
              :style="{ maxWidth: '640px'}">

            <n-form-item label="分类ID" path="categoryId">
              <n-select
                  v-model:value="model.categoryId"
                  placeholder="请选择分类"
                  :options="generalOptions"
              />
            </n-form-item>
            <n-form-item label="标题" path="title">
              <n-input v-model:value="model.title" placeholder="请输入标题内容"/>
            </n-form-item>
            <n-form-item label="内容" path="content">
              <wang-editor v-model="model.content"></wang-editor>
            </n-form-item>
            <div style="display: flex; justify-content: flex-end">
              <n-button round type="primary" @click="handleValidateButtonClick">
                添加
              </n-button>
            </div>
          </n-form>

          <pre>{{ model.content }}</pre>
        </div>
      </n-tab-pane>
      <n-tab-pane name="edit" tab="修改文章">
        修改文章
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, Ref, ref} from "vue";
import {addArtAPI, delArtByIdAPI, getArtAPI, IList, IPage} from "@/apis/article";
import {timeFormat} from "@/utils/timeFormat";
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import type {FormInst, FormItemRule} from 'naive-ui'
import WangEditor from "@/components/editor/WangEditor.vue";
import {getCatAPI, ICategory} from "@/apis/category";

const {message} = useDiscreteAPI();

export default defineComponent({
  components: {WangEditor},
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
    const formRef = ref<FormInst | null>(null);
    // 表单数据对象model
    const model = ref({
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
    const handleValidateButtonClick = (e: MouseEvent) => {
      e.preventDefault()
      formRef.value?.validate(async (errors) => {
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
          message.error('验证失败')
        }
      })
    }
    return {
      pageInfo,
      count,// 文章列表数量
      artList,// 文章列表
      pageChange,// 当前页码改变
      pageSizeChange,// 当前页面容量改变
      delHandler,
      formRef,
      model,
      generalOptions,
      handleValidateButtonClick,
      rules: {
        categoryId: {
          required: true,
          trigger: ['blur', 'change'],
          message: '请选择一种分类'
        },
        title: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入标题'
        },
        content: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入内容'
        }
      },
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