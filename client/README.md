# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue
3 `<script setup>` SFCs, check out
the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in
the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

### 一、v-html使用的注意事项

- 参考文档：[参考文档](https://www.cnblogs.com/sxgwyf/p/17763057.html)
- 使用v-html时要特别小心，确保渲染的内容是值得信任的，以避免跨站脚本攻击（xss）的风险
- XSS，跨站脚本攻击，是web威胁的前十名中，排名第二，仅次于代码注入（Injection）
- 关于XSS,[xss](https://baike.baidu.com/item/XSS%E6%94%BB%E5%87%BB/954065?fr=ge_ala)
