<!--
*@name: ArtFormItem
*@author: Bao Chengyi
*@date: 2024/8/4 19:32
-->
<template>
  <n-form
      ref="sonRef"
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
      <n-button round type="primary" @click="handleValidateClick">
        {{ name === 'add' ? '添加' : '修改'}}
      </n-button>
    </div>
  </n-form>
  <pre>{{ model.content }}</pre>
</template>
<script lang="ts" setup>

import {onMounted, ref} from "vue";
import WangEditor from "@/components/editor/WangEditor.vue";
import {getCatAPI, ICategory} from "@/apis/category";
import {FormInst} from "naive-ui";
import useDiscreteAPI from "@/utils/useDiscreteAPI";

const {message} = useDiscreteAPI();
defineProps(['model', 'handleValidateClick', 'generalOptions','name']);
// 分类列表catList
const catList = ref<ICategory[]>([]);
// 表单数据对象model
// const model = ref({
//   title: '',
//   content: '',
//   categoryId: null
// });

interface IOptions {
  label: string;
  value: string;
}

const generalOptions = ref<IOptions[]>([]);
const sonRef = ref<FormInst | null>(null);
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
  getCatList();
});
const rules = {
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
};
// 将sonRef暴露给父组件ManageArt使用
defineExpose({sonRef});

</script>

<style lang="scss" scoped>

</style>