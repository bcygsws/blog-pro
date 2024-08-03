<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChanged"
    />
  </div>
</template>
<script>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import {onBeforeUnmount, ref, shallowRef, onMounted, defineComponent} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';
import http from '@/utils/http';
import {getToken} from "@/utils/token";

const server_url = http.defaults.baseURL;

export default defineComponent({
  components: {Editor, Toolbar},
  props: {
    // v-model是一个语法糖,相当于向子组件，传递了一个modelValue属性，并且附带一个更新
    // 父组件的方法 update:model-value(是一个暴露给子组件的方法名)
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup(props, {emit}) {
    // console.log(props);
    console.log('test', props.modelValue);

    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();

    // 内容 HTML
    const valueHtml = ref('<p>hello</p>')

    // 模拟 ajax 异步获取内容
    // 维护一个状态变量init，布尔类型；当设定valHtml的事件完成后，再使用update:model-value方法，来让父组件的该值同步
    const init = ref(false);
    onMounted(() => {
      setTimeout(() => {
        valueHtml.value = props.modelValue;
        init.value = true;
      }, 10);
    })

    const toolbarConfig = {
      // 1.禁用部分工具栏，插入视频操作，需要寻找【上传本地视频】的key值
      // 2.确定key的名称：在页面https://www.wangeditor.com/demo/index.html，
      // 3.浏览器控制台输入语句：console.log(toolbar.getConfig().toolbarKeys);
      // 4.上传本地视频禁用，而插入视频 是字符串操作，可以保留
      excludeKeys: ['uploadVideo']
    };
    // 上传本地图片或者网络图片处理
    const editorConfig = {placeholder: '请输入内容...'};
    editorConfig.MENU_CONF = {};
    // a.上传网络图片
    editorConfig.MENU_CONF['insertImage'] = {
      parseImageSrc: (src) => {
        if (src.indexOf('http') !== 0) {// 表示是本地地址
          return `${server_url}${src}`;
        }
        return src;// 网络图片，直接返回src

      }
    }
    // b.上传本地图片，要配置服务端
    // 提交到服务端配置
    editorConfig.MENU_CONF['uploadImage'] = {
      base64LimitSize: 10 * 1024,// 小于10kb，就插入base64格式, 而不上传，默认值为0
      server: `${server_url}/upload/rich_editor_upload`,
      headers: {
        Authorization: getToken()
      }
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return
      editor.destroy();
    })

    const handleCreated = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    }
    const handleChanged = (editor) => {
      console.log(editor.getHtml());
      if (init) {
        emit('update:model-value', valueHtml.value);
      }
    }
    return {
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChanged
    };
  }
});
</script>