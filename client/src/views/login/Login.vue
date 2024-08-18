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
            size="medium"
            :style="{
               maxWidth: '640px',
            }"
        >
          <!--v-model:value值中名称，与后端接口参数的命名保持一致 -->
          <n-form-item label="账号" path="account">
            <n-input v-model:value="model.account" placeholder="请输入账号"/>
          </n-form-item>
          <n-form-item label="密码" path="password">
            <n-input v-model:value="model.password" placeholder="请输入密码" type="password"/>
          </n-form-item>
          <div style="display: flex; justify-content: center;align-items: center;">
            <n-space>
              <n-checkbox v-model:checked="model.remember" class="_checkbox" @update-checked="checkHandler">记住我
              </n-checkbox>
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
import type {FormInst, FormItemRule, FormRules} from 'naive-ui';
// 已经将message等提示组件，使用独立API导出
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import {IForm, loginAPI} from "@/apis/login";
import useLogin from "@/store/login";
import {setToken} from "@/utils/token";
import {encode, decode} from "js-base64";
import resetForm from "@/utils/resetForm";

const {message} = useDiscreteAPI();
const loginStore = useLogin();
export default defineComponent({
  name: "Login",
  setup() {
    // useRouter需要再setup函数内创建实例，否则router.push导航不起作用
    const router = useRouter();
    const formRef = ref<FormInst | null>(null)
    const model = ref<IForm>({
      account: localStorage.getItem('account') || '',
      password: localStorage.getItem('password') ? decode(localStorage.getItem('password')!) : '',
      remember: localStorage.getItem('remember') === '1'
    });
    /**
     * @name:rules
     * 表单校验规则
     *
     *
     * */
    const rules: FormRules = {// 账号、密码校验规则
      account: [{
        required: true,
        validator(rule: FormItemRule, value: string) {
          if (!value) {
            return new Error("用户名不能为空");
          }
          if (value.length < 5 || value.length > 17) {
            return new Error("用户名的长度不少于5个字符，但不超过16个字符")
          }
          return true;
        },
        trigger: ['blur', 'input']
      }],
      password: [{
        required: true,
        validator(rule: FormItemRule, value: string) {
          if (!value) {
            return new Error("密码不能为空");
          }
          if (value.length < 5 || value.length > 17) {
            return new Error("密码的长度不少于5个字符，但不超过16个字符")
          }
          return true;
        },
        trigger: ['blur', 'input'],
      }]
    };

    /**
     * @name:checkHandler
     * @description:记住账号、密码实现
     *
     * */
    const checkHandler = (val: boolean) => {
      console.log(val);
      // 实时记录“记住我”复选框的状态
      model.value.remember = val;
      localStorage.setItem('remember', val ? '1' : '0');
    }
    const handleValidateButtonClick = (e: MouseEvent) => {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (errors) {
          // 密码错误时置空
          model.value.account = '';
          model.value.password = '';
          model.value.remember = false;
          message.error("校验失败，输入的密码或账号不符合要求")
          return;
        }
        // 向后端请求数据，验证登录信息
        const res = await loginAPI({
          account: model.value.account,
          password: model.value.password
        });
        console.log(res);
        if (res.data.code === 200) {// 登录成功
          // 密码在后端已经强制，置空了，密码从文本框中取值
          const token = (res.data.data)!;
          console.log("test token", token);
          message.success('恭喜你，登录成功');
          // 1.将token存储至本地的localStorage
          setToken(token);
          // 2.更新store中变量的状态
          loginStore.$patch({
            token
          });

          // 3.处理将账号、密码存入cookie,方便回显
          if (model.value.remember) {// 如果"记住我"框选中
            localStorage.setItem('account', model.value.account);
            localStorage.setItem('password', encode(model.value.password));
            localStorage.setItem('remember', model.value.remember ? '1' : '0');
          }
          // 4.跳转至/dashboard
          await router.push("/dashboard");
        } else {
          // 账号和密码置空，并且取消选中
          // model.value.account = "";
          //
          // model.value.password = "";
          // model.value.remember = false;
          // clear('MY_TOKEN');// 清除保存的token
          // clear('account');// 清除保存的account
          // clear('password');// 清除保存的password
          // clear('remember');// 清除保存的remember状态
          resetForm(model, 'account', 'password', 'remember', 'MY_TOKEN');
          message.error('登录失败');
        }
      })
    }

    return {
      formRef,
      model,
      rules,
      handleValidateButtonClick,
      checkHandler
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