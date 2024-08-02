<!--
*@name: Login
*@author: Bao Chengyi
*@date: 2024/7/24 21:45
-->
<template>
  <div class="cat-container">
    <!--添加分类 按钮，弹出模态框-->
    <div class="head">
      <n-button type="tertiary" size="medium" @click="addCat">添加分类</n-button>
    </div>
    <n-data-table
        :columns="columns"
        :single-line="false"
        :data="catList"
        :pagination="false"
        :bordered="false"
    />
    <!--修改按钮，点击后，使用Dialog预设的模态框-->
    <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
      <template #header>
        <div>{{ status === 1 ? '修改分类' : '添加分类' }}</div>
      </template>
      <div class="content">
        <n-input v-model:value="catValue.name" placeholder="请输入一个分类"/>
      </div>
      <template #action>
        <div>
          <n-button type="success" size="small" @click="submitChange">{{ status === 1 ? '修改' : '添加' }}</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
<script lang="ts">
import {defineComponent, h, onMounted, ref} from 'vue';
import {NButton} from 'naive-ui'
import type {DataTableColumns} from 'naive-ui';
import UseDiscreteAPI from "@/utils/useDiscreteAPI.ts";
import {addCatAPI, changeCatAPI, getCatAPI, ICategory, delCatAPI} from "@/apis/category.ts";
// 引入独立API
const {message, dialog} = UseDiscreteAPI();


// 为play方法增加一个参数，以区分点击的是【修改】按钮还是【删除】按钮
function createColumns({play}: {
  play: (row: ICategory, title: string) => void
}): DataTableColumns<ICategory> {
  return [
    {
      title: 'ID',
      key: 'id'
    },
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: '操作',
      key: 'actions',
      render(row) {
        return [{title: "修改"}, {title: "删除"}].map((item) => {
          return h(
              NButton,
              {
                strong: true,
                size: 'small',
                type: item.title === '修改' ? 'info' : 'error',
                style: {
                  marginRight: '10px'
                },
                onClick: () => play(row, item.title)
              },
              {default: () => item.title}
          )
        })


      }
    }
  ]
}

export default defineComponent({
  setup() {
    // 修改分类时，模态框的显示和隐藏
    const showModal = ref(false)
    // 修改弹出的模态框中，分类记录：id值和name值
    const catValue = ref<ICategory>({id: 0, name: ''});
    // 维护一个状态量，number类型，0：添加分类；1：修改分类
    const status = ref(0);
    // 定义一个数据，存储获取的分类列表
    const catList = ref<ICategory[] | undefined>([]);

    const columns = createColumns({
      play(row: ICategory, title: string) {
        console.log(row);//
        console.log(title);
        if (title === '修改') {
          // 弹出模态框
          showModal.value = true;
          // 将当前分类，回显到弹出的模态框中
          catValue.value.name = row.name;
          catValue.value.id = row.id;
          // 将status值修改为1
          status.value = 1;


        } else {
          dialog.warning({
            title: '警告',
            content: '你确定删除这条数据吗？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              // 1.确认删除后，将数据提交到服务端
              const res = await delCatAPI(row.id);
              if (res.data.code === 200) {
                // 1.删除成功提示
                message.success(res.data.message);
                // 2.重新请求分类列表
                await getCatList();
              } else {// 点击 确定 按钮后，数据删除仍然失败了
                message.error(res.data.message);
              }

            },
            onNegativeClick: () => {
            }
          })

        }
      }
    });
    /**
     * @获取分类列表
     * bug:刷新当前页面后，pinia数据恢复到
     *
     * */
    const getCatList = async () => {
      // 拿到最新的分类值
      const res = await getCatAPI();
      if (res.data.code === 200) {// 分类列表查询操作成功了
        catList.value = res.data.data;
      }

    }
    onMounted(() => {
      // 刷新页面时，现将token读取出来
      console.log(localStorage.getItem("MY_TOKEN"));
      getCatList();
    })
    /**
     * @name:addCat
     * @description:添加分类 按钮，点击后，事件处理函数
     * 复用 修改 按钮的那个对话框
     *
     * */
    const addCat = () => {
      // 1.弹出对话框
      showModal.value = true;
      // 2.内容区域，文本输入框内容清空
      catValue.value.name = "";
      // 将status值置为0，表示当前 添加分类
      status.value = 0;

    }
    /**
     * @name:
     * @description:修改 按钮点击时，
     * 根据status值，不能处理
     * status为0,添加分类
     * status为1，修改分类
     *
     *
     * */
    const submitChange = async () => {
      if (status.value === 1) {// 修改分类时，提交
        // 将分类提交至后端
        // console.log("test", catValue.value);
        const res = await changeCatAPI(catValue.value);
        console.log(res);
        if (res.data.code === 200) {
          // 1.给出"分类修改成功"提示
          message.success('当前分类已成功修改');
          // 2.关闭对话框
          showModal.value = false;
          // 3.重新请求分类列表
          await getCatList();
        } else {
          message.error(res.data.message);
        }

      } else {// 添加分类时，提交
        const res = await addCatAPI(catValue.value.name);
        if (res.data.code === 200) {// 添加分类成功
          // 1.给出"分类添加成功"提示
          message.success('当前分类已经成功添加');
          // 2.关闭对话框
          showModal.value = false;
          // 3.重新请求分类列表
          await getCatList();
        } else {
          message.error(res.data.message);
        }
      }
    }
    return {
      catList,
      columns,
      showModal,
      catValue,
      submitChange,
      addCat,
      status
    }
  }
});
</script>

<style lang="scss" scoped>
.cat-container {
  /*添加分类样式*/
  .head {
    padding: 5px 0;
    margin: 5px 0;
  }

}

</style>