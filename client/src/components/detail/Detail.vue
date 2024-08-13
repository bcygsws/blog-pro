<!--
*@name: Detail
*@author: Bao Chengyi
*@date: 2024/8/7 23:43
-->
<template>
  <div class="detail-container">
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
      <div class="header">
        <!--切换区-->
        <div class="nav">
          <span>评论{{ total }}</span>
          <div class="switch">
            <a :class="[status?'active':'']" @click="selectedHot">最热</a>
            <a :class="[!status?'active':'']" @click="selectedNew">最新</a>
          </div>
        </div>
        <!--评论区-->
        <div class="comment">
          <div class="left">
            <img src="https://s1.imagehub.cc/images/2023/07/13/img19.th.jpeg" alt="" width="60" height="60"/>
          </div>
          <div class="right">
            <n-input
                type="textarea"
                placeholder="请输入评论内容……"
                v-model:value="comment.content"
                maxlength="140"
                @blur="handleBlur"
                @focus="handleFocus"
                @input="handleInput"
            />
            <div class="btn">
              <n-button size="small" type="success" v-show="flag" @click="handleSubmit">评论</n-button>
            </div>
          </div>

        </div>

      </div>
      <!--列表区-->
      <n-infinite-scroll style="height: 360px" :distance="10" @load="handleLoad">
        <div class="list" v-for="item in resArray" :key="item.id">
          <div class="figure">
            <!--只指定图片的 width和height其中一个，图片会等比例缩放；我们希望宽和高相等-->
            <img :src="item.img" alt="评论" width="60" height="60"/>
          </div>
          <div class="content">
            <span>{{ item.username }}</span>
            <div>{{ item.content }}</div>
            <div class="time">
              <div class="date">{{ timeFormat(item.com_time) }}</div>
              <div class="like">
                <Icon size="16">
                  <ThumbUp/>
                </Icon>
                <span class="count">{{ item.fav }}</span></div>
            </div>
            <n-divider/>
          </div>
        </div>
        <div v-if="loading" class="text">
          加载中...
        </div>
        <div v-if="noMore" class="text">
          没有更多了~
        </div>
      </n-infinite-scroll>
    </div>
  </div>


</template>
<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {_getArtByIdAPI, ICommentList, IList, submitCommentAPI} from "@/apis/article";
import {IComment} from '@/apis/shared';
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import {useRoute, useRouter} from "vue-router";
import {timeFormat} from "@/utils/timeFormat";
import {ThumbUp} from '@vicons/tabler';
import _ from 'lodash';
// 控制icon图标的样式，如：size color和以何种标签渲染的tag等等
import {Icon} from '@vicons/utils';
import {getComByIdAPI} from "@/apis/detail";

const {message} = useDiscreteAPI();
const route = useRoute();
// 根据路由参数获取,当前详情页的artId,即文章列表中每篇文章的id
const artId = parseInt(<string>route.params.id);
const router = useRouter();
const detData = ref<IList>({
  category_id: 0,
  content: "",
  create_time: 0,
  id: 0,
  name: "",
  title: ""
});
// 文本域获取焦点和失去焦点时，控制【评论】按钮的显示和隐藏
const flag = ref(false);
// 默认选中 【最热】
const status = ref(true);
// 定义变量，存储获取到的评论列表
const comArray = ref<IComment[]>([]);
// 定义变量，当前存储获取到的评论列表
const curArray = ref<IComment[]>([{
  id: 0,
  art_id: 0,
  img: '',
  fav: 0,
  content: '',
  com_time: 0,
  username: ''
}]);
// 定义变量，comment 存储textarea文本和提交的fav值
const comment = reactive<ICommentList>({
  id: 0,// 当前评论列表的id
  artId: artId,// 当前所在详情页的分类id
  content: "",
  fav: 0,
  page: 1,// 当前所在页数
  pageSize: 5// 每页数据容量
});

// loading存储加载状态，true：正在加载；false:加载完成
const loading = ref(false);
// 判断条件，是否还有数据

const noMore = ref(false);
// 利用watch初始时，不侦听；那么noMore.value值还是false
watch(curArray, (val) => {
  // console.log("t1", noMore.value);
  // console.log(val);
  noMore.value = (val.length == 0);
  console.log("t2", noMore.value);
});
/**
 * @name:
 * @description:根据路由id,my_list表中art_id请求数据
 *
 *
 * */
const initialPage = ref(1);
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

const getCommentList = async (val: number) => {
  const res = await getComByIdAPI({
    artId: artId,
    page: val,
    pageSize: comment.pageSize as number
  });
  console.log(res);
  if (res.data.code == 200) {
    message.success(res.data.message);
    comArray.value = res.data.data!;
  } else {
    // message.error(res.data.message);
  }
}
/**
 * @计算属性监听，comArray的数组元素排列方法，按照fav降序，和按照时间降序
 *
 * */
const resArray = computed(() => {
  if (status.value) {
    return _.orderBy(comArray.value, 'fav', 'desc');
  } else {
    return _.orderBy(comArray.value, 'com_time', 'desc');
  }
});
/**
 * @name:
 * @description:根据数组长度，获取总评论条数
 *
 * */
const total = computed(() => {
  return comArray.value.length;
})
onMounted(() => {
  getArtDetail();
  getCommentList(initialPage.value);
});
/**
 * @name:backHandler
 * @description：返回按钮 事件处理
 *
 * */
const backHandler = () => {
  router.back();

}
/**
 * @textarea评论区事件
 *
 *
 * */
const handleBlur = () => {
  // flag.value = false;
}
const handleFocus = () => {
  flag.value = true;
}
/**
 * @name:handleInput
 * @description:文本域的输入事件
 * 控制输入的字符数，在140个以内；超出限制，截取
 *
 * */
const handleInput = (val: string) => {
  if (val.length > 139) {
    message.error('输入超过了140个字符~');
  }

}
/**
 * @name:
 * @description:控制列表的切换
 *
 * */
const selectedHot = () => {
  status.value = true;
}
const selectedNew = () => {
  status.value = false;
}
/**
 * @name:handleSubmit
 * @description:评论 按钮"提交"，事件处理函数
 *
 * */
const handleSubmit = async () => {
  console.log(comment);
  // 1.将评论内容，提交至服务端
  const res = await submitCommentAPI({artId: comment.artId, content: comment.content});
  console.log(res.data);
  if (res.data.code === 200) {
    // 1.添加成功提示
    message.success(res.data.message);
    // 2.提交评论后，隐藏【评论】按钮
    flag.value = false;
    // 3.清空文本域textarea,方便下一次输入
    comment.content = "";
    // 4.重新请求详情和评论列表
    await getCommentList(initialPage.value);
  } else {
    message.error(res.data.message);
  }
}
/**
 * @name:
 * @description:无限滚动的处理
 *
 * */
const handleLoad = async () => {
  if (loading.value || noMore.value) {
    return;
  }
  loading.value = true;
  initialPage.value++;
  console.log(initialPage.value);
  // 做延时处理，便于看到下拉加载效果
  await new Promise((resolve)=>{
    setTimeout(()=>{resolve('');},500)
  })
  const res = await getComByIdAPI({
    artId: artId,
    page: initialPage.value,
    pageSize: <number>comment.pageSize
  });
  if (res.data.code === 200) {
    curArray.value = res.data.data!;
    console.log("test res", curArray.value);
    comArray.value = [...comArray.value, ...curArray.value];
  } else {
    curArray.value = [];
    initialPage.value = 1;
  }
  loading.value = false;
}
</script>

<style lang="scss" scoped>
.detail-container {
  width: 1000px;
  margin: 0 auto;
}

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
  /*切换区*/
  .header {
    display: flex;
    flex-flow: column nowrap;
    padding: 10px;
    box-sizing: border-box;

    .nav {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-bottom: 10px;

      > span {
        font-size: 18px;
      }

      .switch {
        margin-left: 15px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        cursor: pointer;

        > a {
          font-size: 16px;
          color: #aaaaaa;

          &:first-child::after {
            content: '|';
            padding: 0 10px;
          }
        }

        .active {
          color: #666666;

        }
      }
    }

    .comment {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      //min-height: 120px;
      height: 120px;

      .left {
        width: 80px;
        /*background-color: pink;*/
        padding: 10px;
        box-sizing: border-box;

        img {
          border-radius: 30px;
        }
      }

      .right {
        flex: 1;
        height: 120px;
        box-sizing: border-box;
        //background-color: pink;
        position: relative;

        .btn {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 30px;
          margin-top: 10px;

          .n-button {
            position: absolute;
            right: 0;
            top: 0;
          }
        }
      }
    }

  }

  .list {
    display: flex;
    flex-flow: row nowrap;
    min-height: 120px;
    padding: 0 10px;

    .figure {
      width: 80px;
      height: 120px;
      //background-color: pink;
      padding: 10px 10px;
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
      padding: 0 5px;

      > span {
        flex: 1;
        font: normal 700 15px 'Arial';
        color: #777777;
      }

      > div {
        flex: 4;
        padding: 10px 0;
        font-size: 16px;
      }

      .time {
        flex: 1;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        .date {
          margin-right: 30px;
          font-size: 14px;
        }

        .like {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;

          .count {
            margin-left: 5px;
            font-size: 14px;
          }
        }
      }
    }
  }
}

/*加载中或者加载完成提示 样式*/
.text {
  text-align: center;
}

</style>