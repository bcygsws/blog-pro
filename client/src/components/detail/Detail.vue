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
        <n-button type="success" size="medium" @click="backHandler">返回</n-button>
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
      <n-infinite-scroll style="height: 400px" :distance="10" @load="handleLoad">
        <div class="list" v-for="item in resArray" :key="item.id">
          <div class="figure">
            <!--只指定图片的 width和height其中一个，图片会等比例缩放；我们希望宽和高相等-->
            <img :src="item.img" alt="评论" width="60" height="60"/>
          </div>
          <div class="content">
            <span>{{ item.username }}</span>
            <div>{{ item.content }}</div>
            <div class="time">
              <div class="date">
                <span class="show-time">{{ timeFormat(item.com_time) }}</span>
                <div class="like">
                  <Icon size="16">
                    <ThumbUp @click="handleClick(item.id,item.fav)"/>
                  </Icon>
                  <span class="count">{{ item.fav }}</span></div>
              </div>
              <!--只有用户名为admin,确认是自己的，才可以删除；别人的评论无权删除-->
              <a class="del" @click="delById(item.id)" v-if="user===item.username">删除</a>
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
import {computed, onMounted, reactive, ref} from "vue";
import {_getArtByIdAPI, IList} from "@/apis/article";
import {IComment} from '@/apis/shared';
import useDiscreteAPI from "@/utils/useDiscreteAPI";
import {useRoute, useRouter} from "vue-router";
import {timeFormat} from "@/utils/timeFormat";
import {ThumbUp} from '@vicons/tabler';
import _ from 'lodash';
// 控制icon图标的样式，如：size color和以何种标签渲染的tag等等
import {Icon} from '@vicons/utils';
import {
  delComByIdAPI,
  getComByTimeAPI,
  ICommentList,
  putComFavAPI,
  submitCommentAPI
} from "@/apis/detail";
import {getToken} from "@/utils/token";

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
const curArray = ref<IComment[]>([]);
// 定义变量，comment 存储textarea文本和提交的fav值
const comment = reactive<ICommentList>({
  id: 0,// 当前评论列表的id
  artId: artId,// 当前所在详情页的分类id
  content: "",
  fav: 0,
  pageSize: 4,// 每页数据容量
  timestamp: Date.now(),// 时间初始值设置为当前时间

});

// loading存储加载状态，true：正在加载；false:加载完成
const loading = ref(false);
// 判断条件，是否还有数据

let noMore = computed(() => {
  return comment.timestamp === 0;
});
// 当前用户名
const user = ref("");
/**
 * @name:
 * @description:根据路由id,my_list表中art_id请求数据
 *
 *
 * */
const getArtDetail = async () => {
  const res = await _getArtByIdAPI(parseInt(<string>route.params.id));
  if (res.data.code === 200) {
    console.log(res.data);
    detData.value = res.data.data!;
    // console.log(typeof res.data.data!.create_time);// number
    message.success("详情页数据请求成功");
  } else {
    message.error("详情页数据请求失败");
  }
}

const getCommentList = async () => {
  const res = await getComByTimeAPI({
    artId: artId,
    timestamp: Date.now(),
    pageSize: comment.pageSize as number
  });
  console.log(res);
  if (res.data.code == 200) {
    message.success(res.data.message);
    comArray.value = res.data.data?.list!;
    comment.timestamp = res.data.data?.pre_timestamp;
    console.log("test res", comment.timestamp);
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
  // 获取当前登录用户名
  getUserInfo();
  getArtDetail();
  getCommentList();

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
 * @textarea评论区事件处理
 * */
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
    // 已经展开滚动到底的页面，在添加新记录后，重新初始化
    // 4.重新请求详情和评论列表
    await getCommentList();
  } else {
    message.error(res.data.message);
  }
}
/**
 * @name:
 * @description:无限滚动的处理
 * 1.最后一次取数据时，返回的pre_timestamp为0，作为noMore成为true的条件
 * 表示，数据已经取完了
 *
 *
 *
 * */
const handleLoad = async () => {
  console.log("noMore", noMore.value);
  if (loading.value || noMore.value) {
    return;
  }
  console.log("我执行了2");
  loading.value = true;
  // 做延时处理，便于看到下拉加载效果
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, 1000);
  });
  const res = await getComByTimeAPI({
    artId: artId,
    timestamp: <number>comment.timestamp,
    pageSize: <number>comment.pageSize
  });
  if (res.data.code === 200) {
    curArray.value = res.data.data?.list!;
    comment.timestamp = res.data.data?.pre_timestamp;
    console.log("test res", curArray.value);
    console.log("test res", comment.timestamp);
    comArray.value = [...comArray.value, ...curArray.value];
  } else {// 当请求出错时，恢复最初状态
    curArray.value = [];
    comment.timestamp = Date.now();
  }
  loading.value = false;
}
/**
 * @name:handleClick
 * @description:点赞后，点赞数+1
 *
 * */
const handleClick = async (id: number, fav: number) => {
  console.log(id, fav);
  // 点赞一次，fav在原来值上+1
  comArray.value.some(item => {
    if (item.id == id) {
      item.fav += 1;
      return true;
    }
  });
  // 提交到数据库
  const res = await putComFavAPI({id: id, fav: fav + 1});
  console.log(res.data);

}
/**
 * @name:delById
 * @description:根据id删除，一条评论记录
 *
 *
 * */
// 定义方法，获取当前用户信息
const getUserInfo = () => {
  const token = getToken();
  user.value = <string>localStorage.getItem('account');
  return {
    token,
    username: user.value
  }
}
const delById = async (id: number) => {
  const {token, username} = getUserInfo();
  if (token && username === 'admin') {
    // 从数组中将元素删除
    comArray.value.some((item, index) => {
      if (item.id === id) {
        comArray.value.splice(index, 1);
        return true;
      }
    });
    // 将该条从数据库中删除
    const res = await delComByIdAPI(id);
    if (res.data.code === 200) {
      message.success(res.data.message);
      await getCommentList();
    } else {
      message.error(res.data.message);
    }


  } else {
    message.error("删除当前记录失败");
  }
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
    padding: 10px 0;
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
        justify-content: space-between;

        .date {
          display: flex;
          flex-flow: row nowrap;

          .show-time {
            margin-right: 30px;
            font-size: 14px;

          }

          .like {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            cursor: pointer;

            .count {
              margin-left: 5px;
              font-size: 14px;
            }
          }
        }

        a.del {
          font-size: 14px;
          cursor: pointer;

          &:hover {
            color: #2080F0;
          }
        }


      }

      .n-divider:not(.n-divider--vertical) {
        margin: 10px 0;
      }
    }
  }
}

/*加载中或者加载完成提示 样式*/
.text {
  text-align: center;
}

</style>
