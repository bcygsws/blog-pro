<!--
*@name: Detail
*@author: Bao Chengyi
*@date: 2024/8/7 23:43
-->
<template>
  <n-card
      :title="'标题：'+detData.title"
      :segmented="{
           content: true,
            footer: 'soft',
          }"
      header-style="font-size: 22px;font-weight: 700"
      footer-style="font-size: 16px;padding:10px 0"
  >
    <template #header-extra>
      <n-button type="info" size="medium" @click="backHandler">返回</n-button>
    </template>
    <div class="content" v-html="detData.content"></div>
    <template #footer>
      <div class="detail-footer">
        <!--创建时间;bug:date-fns包可以传Date对象、时间戳number和字符串时间，使用||操作
        处理detData['create_time']还没有取到值时的错误;已经在工具文件timeFormat.ts中统一处理-->
        <span>创建时间：{{ timeFormat(detData['create_time']) }}</span>
        <!--所属分类-->
        <span>所属分类：{{ detData.name }}</span>
      </div>
    </template>
  </n-card>
  <div class="comment">
    <!--切换区-->
    <!--评论区-->
    <!--列表区-->
    <div class="list">
      <div class="figure">
        <img src="../../assets/vue.svg" alt="" width="60"/>
      </div>
      <div class="content">
        <span>用户1</span>
        <div>agfdsgagaghaggfagfasga</div>
        <div class="time">
          <div class="date">2023-12-12 12:12:01</div>
          <div class="like">点赞icon<span>13</span></div>
        </div>
      </div>
    </div>
  </div>


</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {_getArtByIdAPI, IList} from "@/apis/article";
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import {useRoute, useRouter} from "vue-router";
import {timeFormat} from "@/utils/timeFormat"

const {message} = useDiscreteAPI();
const route = useRoute();
const router = useRouter();
const detData = ref<IList>({category_id: 0, content: "", create_time: 0, id: 0, name: "", title: ""});
const getArtDetail = async () => {
  const res = await _getArtByIdAPI(parseInt(<string>route.params.id));
  if (res.data.code === 200) {
    console.log(res.data);
    detData.value = res.data.data!;
    console.log(typeof res.data.data!.create_time);// number
    message.success("详情页数据请求成功");
  } else {
    message.error("详情页数据请求失败");

  }
}
onMounted(() => {
  getArtDetail();
});
/**
 * @name:backHandler
 * @description：返回按钮 事件处理
 *
 * */
const backHandler = () => {
  router.back();

}

</script>

<style lang="scss" scoped>
.n-card {
  .detail-footer {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    span:first-child {
      margin-right: 30px;
    }
  }

}

.comment {
  display: flex;
  flex-flow: column nowrap;

  .list {
    display: flex;
    flex-flow: row nowrap;
    min-height: 120px;

    .figure {
      width: 80px;
      height: 120px;
      //background-color: pink;
      padding: 0 10px;
      box-sizing: border-box;

      > img {
        border-radius: 30px;
      }

    }

    .content {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      //background-color: purple;
      width: 100px;
      padding: 5px 15px;

      > span {
        flex: 1;
      }

      > div {
        flex: 4;
        padding: 10px 0;
      }

      .time {
        flex: 1;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        .date {
          margin-right: 30px;
        }
      }
    }
  }
}


</style>