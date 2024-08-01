import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
/**
 * @bug：
 * 参考文档：https://juejin.cn/post/7130887368042610718
 * 安装了@types/node仍然找不到path模块，而且__dirname爆红
 * 解决：需要给webstorm用户补充一点，在Languages&Frameworks>TypeScript>Vue中选择Vue Language Server(Volar)
 * 在vscode中同理，也需要使用Volar插件，并禁用Vetur插件
 *
 * */
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {// src路径别名配置
        alias: {// 需要安装识别path和__dirname的模块@types/node
            '@': path.join(__dirname, './src')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/styles/variables.scss";',
                javascriptEnabled: true
            }
        }
    }

})
