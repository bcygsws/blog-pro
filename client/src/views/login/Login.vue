<!--
*@name: Login
*@author: Bao Chengyi
*@date: 2024/7/25 2:37
-->
<template>
  <div class="login-container">
    <div class="card">
      <!--将title居中，设置header-style-->
      <n-card title="管理后台登录" header-style="text-align:center;">
        <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            label-placement="left"
            require-mark-placement="right-hanging"
            :size="size"
            :style="{
               maxWidth: '640px',
            }"
        >
          <n-form-item label="账号" path="account">
            <n-input v-model:value="model.account" placeholder="请输入账号"/>
          </n-form-item>
          <n-form-item label="密码" path="pwd">
            <n-input v-model:value="model.pwd" placeholder="请输入密码" type="password"/>
          </n-form-item>
          <div style="display: flex; justify-content: center;align-items: center;">
            <n-space>
              <n-checkbox v-model:checked="value" class="_checkbox">记住我</n-checkbox>
              <n-button round type="primary" @click="handleValidateButtonClick">
                登录
              </n-button>
            </n-space>

          </div>
        </n-form>
      </n-card>
    </div>


  </div>


</template>
<script lang="ts">
import {defineComponent, ref} from "vue";
import {useRouter} from "vue-router";
import type {FormInst, FormItemRule} from 'naive-ui'
// 已经将message等提示组件，使用独立API导出
import useDiscreteAPI from "@/utils/useDiscreteAPI";

const {message} = useDiscreteAPI();
export default defineComponent({
  setup() {
    // useRouter需要再setup函数内创建实例，否则router.push导航不起作用
    const router = useRouter();
    const formRef = ref<FormInst | null>(null)
    const size = ref("medium");
    const model = ref({
      account: 'admin',
      pwd: '123456'
    });

    return {
      formRef,
      size,
      model,
      value: ref(false),// 记住我复选框，状态控制
      rules: {// 账号、密码校验规则
        account: {
          required: true,
          trigger: ['blur', 'input'],
          message: '用户名不能为空'
        },
        pwd: {
          required: true,
          trigger: ['blur', 'input'],
          message: '密码不能为空'
        }
      },
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            if (model.value.account === 'admin' && model.value.pwd === '123456') {
              // 跳转至/dashboard
              router.push("/dashboard");

            }
            message.success('验证成功')
          } else {
            console.log(errors)
            message.error('验证失败')
          }
        })
      }
    }
  }
});

</script>

<style lang="scss" scoped>
.login-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  .card {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 250px;


  }

  ._checkbox {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}

</style>