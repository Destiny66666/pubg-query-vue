<script setup>
import NavVue from "@/components/Nav.vue";
import FooterVue from "@/components/Footer.vue"
import {Menu, DArrowRight, Close} from "@element-plus/icons-vue";
import {ref, onMounted, onBeforeUnmount} from "vue";
import {getTouristArticleListsData} from "@/api/articleApis.js"
import {getHistoryQueryData, getPubgUserPlayer} from "@/api/pubgApis.js";
import {pubgUserPlayer} from "@/stores/pubgUserPlayer.js";
import {useRouter} from "vue-router";
import {getSearchName, setSearchName, deleteSearchNameByIndex} from "@/util/searchName.js"
import {refreshPubgOnline} from "@/util/refreshPubgOnline.js"
import {Icon} from '@iconify/vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getOnlineUserFirst} from "@/util/refreshPubgOnline.js"

const onlineUsers = ref()
const router = useRouter();
let platform = ref('steam')
let searchName = ref('')
const activeNames = ref()
const pubgUserPlayerStore = pubgUserPlayer()
const searchNameList_isno = ref(true)
const searchNameList = ref()
const historyQuery = ref()
searchNameList.value = getSearchName()

const checkSearchNameList = () => {
  if (typeof searchNameList.value?.length === 'undefined' || searchNameList.value?.length === 0) {
    searchNameList_isno.value = true
  } else {
    searchNameList_isno.value = false
  }
}

const articleList = ref()

const getTouristArticleLists = async () => {
  const result = await getTouristArticleListsData()
  articleList.value = result.data.data
  console.log(result)
}

const searchBtn = async () => {
  NProgress.start()
  setSearchName(searchName.value)
  const result = await getPubgUserPlayer({
    'platform': platform.value,
    'searchName': searchName.value,
  }).then((result) => {
    NProgress.done()
    setTimeout(() => {
      pubgUserPlayerStore.setPubgUserPlayer(result.data)
      router.push({
        path: '/query/player-query',
        query: {searchName: searchName.value, platform: platform.value, accountId: result.data.id}
      });
    }, 300);
  }).catch((err) => {
    NProgress.done()
  });
  ;
}

const handleClickOutside = (event) => {
  // 检查点击是否发生在collapse外
  if (!event.target.closest('.el-collapse')) {
    activeNames.value = []; // 折叠所有项
  }
};

onMounted(async () => {
  await refreshPubgOnline()
  document.addEventListener('click', handleClickOutside);
  checkSearchNameList()
  await getHistoryQuery()
  await getTouristArticleLists()
  onlineUsers.value = getOnlineUserFirst()
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);

});
const deleteSearchName = (index) => {
  searchNameList.value = searchNameList.value.filter((_, i) => i !== index)
  deleteSearchNameByIndex(index)
  checkSearchNameList()
}

const search = (data) => {
  searchName.value = data
  searchBtn()
}

const getHistoryQuery = async () => {
  const result = await getHistoryQueryData()
  historyQuery.value = result.data
}

const toSearch = (data) => {
  searchName.value = data
  searchBtn()
}

const show = (data) => {
  return data % 2 === 0
}

const moreBtn = ()=>{
  router.push({path:'/news'})
}
const articleBtn = (id)=>{
  router.push(`/article/${id}`)
}
</script>

<template>
  <div class="div">
    <NavVue></NavVue>
    <div class="search_div">
      <div class="search_background">
      </div>
      <div class="search_img">
        <div class="search_img_div">
          <img src="../assets/query-bg.png" alt="">
          <div class="search_img_vague"></div>
        </div>
      </div>
      <div class="search">
        <div class="search_log">
          <img src="../assets/logo1.DuBK4ygT.png" alt="">
          <div class="pubg_count">
            <p>
              PUBG当前在线玩家人数：<span>{{ onlineUsers }}</span>
            </p>
          </div>
          <div class="search_input">
            <div class="search_platform">
              <div class="platform_btn" :class="{platform_btn_visited:platform==='steam'}" @click="platform='steam'">
                Steam
              </div>
              <div class="platform_btn" :class="{platform_btn_visited:platform==='kakao'}" @click="platform='kakao'">
                KaKao
              </div>
              <p>微信公众号：</p>
            </div>
            <div class="search_input_div">
              <el-collapse v-model="activeNames" accordion style="width: 100%" @click.native="handleClickOutside">
                <el-collapse-item title="Consistency" name="1">
                  <template #title>
                    <input type="text" placeholder="请输入你的游戏昵称(注意大小写)" v-model="searchName">
                    <button class="search_btn" @click="searchBtn">开始搜索</button>
                  </template>
                  <template #icon="{ isActive }">
                    <span style="display: none">
                      {{ isActive ? 'Expanded' : 'Collapsed' }}
                    </span>
                  </template>
                  <el-row style="z-index: 999 !important;">
                    <el-col :span="24" v-show="!searchNameList_isno">
                      <el-row>
                        <el-col :span="24" style="padding-bottom: 0; font-size: 16px;">
                          历史记录
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8" v-for="(item, index) in searchNameList"
                                :key="index" class="search_name_item">
                          <div class="search_name" @click="search(item)">{{ item }}</div>
                          <el-icon class="search_name_delete" @click="deleteSearchName(index)">
                            <Close/>
                          </el-icon>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col v-show="searchNameList_isno" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"
                            style="height: 140px; display: flex; justify-content: center; align-items: center; flex-direction: column">
                      <Icon icon="solar:confounded-square-linear" width="40px" style="color: #449dd5"/>
                      <div>当前没数据</div>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
      <div class="search_catch">
        <div class="search_catch_info" v-for="(item, index) in historyQuery" :key="index"
             @click="toSearch(item.username)">
          <img src="../assets/pubg-logo.BqOSxfxe.jpg" alt="" class="search_catch_info_img">
          <span class="search_catch_info_name">{{ item.username }}</span>
          <span class="search_catch_info_time">{{ item.formatted_timestamp }}</span>
        </div>
      </div>
    </div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
        <img src="../assets/29e4f762ec6421d1d6332f9cee09903667bd2b56.png" alt="" class="image">
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
        <div class="article_div">
          <div class="article_div_left">
            <el-icon :size="20" color="#409efc">
              <Menu/>
            </el-icon>
            <span>游戏资讯</span>
          </div>
          <div class="article_div_right">
            <span @click="moreBtn()">更多 >>></span>
            <!--<el-icon :size="16" ><DArrowRight /></el-icon>-->
          </div>
        </div>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="padding_0">
            <div class="article_info" v-for="(item, index) in articleList" :key="index" v-show="index % 2 !== 0">
              <div class="article_info_left">
                <div>·</div>
                <div class="article_title" @click="articleBtn(item.id)">
                  {{item.title}}
                </div>
              </div>
              <div class="article_info_right">
                <div v-show="item.index !== 100">{{((item.create_time).split(' ')[0]).slice(-5)}}</div>
                <el-tag v-show="item.index === 100" type="danger">置顶</el-tag>
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="padding_0">
            <div class="article_info" v-for="(item, index) in articleList" :key="index" v-show="index % 2 === 0">
              <div class="article_info_left">
                <div>·</div>
                <div class="article_title" @click="articleBtn(item.id)">
                  {{item.title}}
                </div>
              </div>
              <div class="article_info_right">
                <div v-show="item.index !== 100">{{((item.create_time).split(' ')[0]).slice(-5)}}</div>
                <el-tag v-show="item.index === 100" type="danger">置顶</el-tag>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <FooterVue></FooterVue>
  </div>
</template>

<style scoped>
.search_name_delete {
  cursor: pointer;
}

.search_name:hover {
  color: rgb(20, 172, 243);
}

.search_name {
  font-size: 16px;
  cursor: pointer;
  width: 80%;
  white-space: nowrap;
  /* 确保文本在一行内显示 */
  overflow: hidden;
  /* 隐藏超出容器的文本 */
  text-overflow: ellipsis;
  /* 使用省略号表示被截断的文本 */
}

.search_name_item {
  display: flex;
  justify-content: space-between;
  align-items: center;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0;
}

::v-deep .el-collapse {
  --el-collapse-border-color: none;
  margin-top: 5px;
  --el-collapse-header-height: none;
  --el-collapse-header-bg-color: none;
}

::v-deep .el-collapse-item__content {
  padding-top: 10px;
}

::v-deep .el-collapse-item__wrap {
  border-bottom-left-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
  margin-top: -10px;
}

.el-collapse-item__arrow {
  display: none !important;
}

.div {
  background-color: rgb(243 243 243);
}

.article {
  width: 100%;
  background-color: rgb(243 243 243);
}

.search_img_vague {
  opacity: 0.4;
  position: absolute;
  top: 0;
  left: 50px;
  width: 98%;
  max-width: 100%;
  z-index: 10;
  height: 350px;
  background: linear-gradient(90deg, #6c5f53, #a79662);
  border-bottom-left-radius: 150px;
}

.article_info {
  padding: 10px 0;
  display: flex;
  justify-content: space-around;
}

.article_info_left {
  display: flex;
  width: 70%;
}

.article_title:hover{
  color: #0099ff;
}

.article_title {
  cursor: pointer;
  margin-left: 10px;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  text-overflow: ellipsis;
  /* 用省略号表示被隐藏的部分 */
  max-width: 80%;
  /* 设置最大宽度以限制文本的显示长度 */
}

.article_div {
  display: flex;
  justify-content: space-between;
}

.article_div_left {
  display: flex;
  align-items: center;
}

.article_div_right {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.image {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
  object-position: center;
  cursor: pointer;
}

.row-bg {
  width: 90%;
  margin: 50px auto;
  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: 10px;
  background-color: white;
}

.bg-purple-pink {
  background-color: pink;
}

.el-row {


  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  padding: 10px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.search_div {
  position: relative;
  z-index: 1;
}

.search_background {
  position: absolute;
  width: 100%;
  height: 460px;
  background: linear-gradient(90deg, #451a12, #a79662)
}

.search_img {
  position: absolute;
  width: 100%;
  overflow: hidden;
  /* 裁剪超出的部分 */
}

.search_img_div {
  position: relative;
  height: 350px
}

.search_img img {
  border-bottom-left-radius: 150px;
  object-position: top;
  object-fit: cover;
  width: 100%;
  height: 350px;
  right: -50px;
  position: absolute;
  max-width: 100%
}

.search {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 40px;
  z-index: 999;
}

.search_log {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search_log img {
  height: auto;
  /* 保持图片的宽高比 */
}

.pubg_count {
  color: white;
  font-size: 20px;
}

.pubg_count span {
  font-size: 28px;
  color: rgb(244, 207, 58);
}

.search_input {
  width: 600px;
  height: 100px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

}

.platform_btn {
  width: 80px;
  height: 26px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  border: 1px solid #b1a9a9;
  margin: 0 5px;
}

.search_platform p {
  margin-left: 20px;
}

.platform_btn_visited {
  background: rgb(217, 165, 72);
  color: rgb(248, 248, 248);
  border-color: rgb(217, 165, 72);
}

.search_platform {
  height: 50%;
  display: flex;
  align-items: center;
}

.search_input_div {
  border-top: 1px solid #c6b9b9;
  height: 50%;
  display: flex;
}

.search_input_div input {
  font-size: 16px;
  height: 100%;
  margin-left: 7px;
  flex: 3;
  border: none;
  outline: none;
}

.search_btn {
  border-radius: 5px;
  margin: auto 10px;
  height: 40px;
  cursor: pointer;
  width: 100px;
  background: rgb(217, 165, 72);
  color: rgb(248, 248, 248);
  border: none rgb(217, 165, 72);
}

.search_catch {
  margin-top: 70px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100 !important;

}

.search_catch_info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  width: 80px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.search_catch_info:hover {
  transform: scale(1.1); /* 缩放比例，1.2 表示放大 20% */
}

.search_catch_info_img {
  width: 50px;
  border-radius: 50%;
}

.search_catch_info_name {
  margin: 3px 0;
  color: white;
  font-size: 14px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.search_catch_info_time {
  color: white;
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .search_img img {
    position: relative;
    width: 200%;
    right: -10px;
    border-bottom-left-radius: 100px;
  }


  .pubg_count {
    font-size: 18px;
  }

  .search_log img {
    width: 150px;
  }

  .search_input {
    width: 90vw;
  }

  .search_catch {
    margin-top: 90px;
  }

  .search_catch_info_img {
    width: 40px;
  }

  .search_catch_info_name {
    margin: 1px 0;
    font-size: 12px;
  }

  .search_catch_info_time {
    font-size: 10px;
  }

  .article_title {
    margin-left: 0;
  }

  .padding_0 {
    padding: 0;
  }

  .search_catch_info {
    display: none;
  }

  .search_catch_info:nth-child(-n+5) {
    display: flex;
  }
}
</style>
