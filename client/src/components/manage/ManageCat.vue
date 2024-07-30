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
        :data="data"
        :pagination="false"
        :bordered="false"
    />
    <!--修改按钮，点击后，使用Dialog预设的模态框-->
    <n-modal v-model:show="showModal" preset="dialog" title="Dialog">
      <template #header>
        <div>{{ status === 1 ? '修改分类' : '添加分类' }}</div>
      </template>
      <div class="content">
        <n-input v-model:value="catValue" placeholder="请输入一个分类"/>
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
import {defineComponent, h, ref} from 'vue';
import {NButton} from 'naive-ui'
import type {DataTableColumns} from 'naive-ui';
import UseDiscreteAPI from "@/utils/useDiscreteAPI.ts";
// 引入独立API
const {message, dialog} = UseDiscreteAPI();

interface ICategory {
  id: number
  name: string
}

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

const data: ICategory[] = [
  {id: 3, name: 'Wonderwall'},
  {id: 4, name: 'Don\'t Look Back in Anger'},
  {id: 12, name: 'Champagne Supernova'}
]

export default defineComponent({
  setup() {
    // 修改分类时，模态框的显示和隐藏
    const showModal = ref(false)
    // 修改弹出的模态框中，分类值
    const catValue = ref("");
    // 维护一个状态量，number类型，0：添加分类；1：修改分类
    const status = ref(0);

    const columns = createColumns({
      play(row: ICategory, title: string) {
        console.log(row);//
        console.log(title);
        if (title === '修改') {
          // 弹出模态框
          showModal.value = true
          // 将当前分类，回显到弹出的模态框中
          catValue.value = row.name;
          // 将status值修改为1
          status.value = 1;


        } else {
          dialog.warning({
            title: '警告',
            content: '你确定删除这条数据吗？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
              message.success('确定');
            },
            onNegativeClick: () => {
            }
          })

        }
      }
    });
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
      catValue.value = "";
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
    const submitChange = () => {
      if (status.value === 1) {// 修改分类时，提交

      } else {// 添加分类时，提交

      }
    }
    return {
      data,
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

  .content {
  }
}

</style>