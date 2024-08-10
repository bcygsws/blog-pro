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
              maxlength="140"
              @blur="handleBlur"
              @focus="handleFocus"
              @change="handleChange"
              @input="handleInput"
          />
          <div class="btn">
            <n-button size="small" type="success" v-show="flag">评论</n-button>
          </div>
        </div>

      </div>

    </div>
    <!--列表区-->
    <div class="list" v-for="item in resArray" :key="item.id">
      <div class="figure">
        <!--只指定图片的 width和height其中一个，图片会等比例缩放；我们希望宽和高相等-->
        <img :src="item.img" alt="" width="60" height="60"/>
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
  </div>


</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {_getArtByIdAPI, IComment, IList} from "@/apis/article";
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import {useRoute, useRouter} from "vue-router";
import {timeFormat} from "@/utils/timeFormat";
import {ThumbUp} from '@vicons/tabler';
import _ from 'lodash';
// 控制icon图标的样式，如：size color和以何种标签渲染的tag等等
import {Icon} from '@vicons/utils';

const {message} = useDiscreteAPI();
const route = useRoute();
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
const flag = ref(false)
// 默认选中 【最热】
const status = ref(true);
// 定义变量，存储获取到的评论列表
const comArray = ref<IComment[]>([]);
const getArtDetail = async () => {
  const res = await _getArtByIdAPI(parseInt(<string>route.params.id));
  if (res.data.code === 200) {
    console.log(res.data);
    detData.value = res.data.data!;
    comArray.value = detData.value.comment_list!;
    console.log(typeof res.data.data!.create_time);// number
    message.success("详情页数据请求成功");
  } else {
    message.error("详情页数据请求失败");
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
  flag.value = false;
}
const handleFocus = () => {
  flag.value = true;
}
const handleChange = () => {
}
const handleInput = () => {
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


</style>