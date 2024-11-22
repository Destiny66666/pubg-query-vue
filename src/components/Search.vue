<script setup>
import {onBeforeUnmount, onMounted, ref, defineProps} from "vue";
import {Icon} from "@iconify/vue";
import {Close} from "@element-plus/icons-vue";
import NProgress from "nprogress";
import 'nprogress/nprogress.css'
import {deleteSearchNameByIndex, getSearchName, setSearchName} from "@/util/searchName.js";
import {getPubgUserPlayer} from "@/api/pubgApis.js";
import {pubgUserPlayer} from "@/stores/pubgUserPlayer.js";
import {useRoute, useRouter} from "vue-router";
import { ElMessage } from 'element-plus'

const pubgUserPlayerStore = pubgUserPlayer()
let platform = ref('steam')
const activeNames = ref()
const searchName = ref('')
const searchNameList_isno = ref(true)
const searchNameList = ref()
const route = useRoute()
const router = useRouter();
const steamId = ref()

const props = defineProps({
  showOnline: {
    type: Boolean,
    default: false
  },
  onlineUsers: {
    type: Number,
  },
  isPubgSearch: {
    type: Boolean,
    default: true
  },
  isVacSearch:{
    type: Boolean,
    default: false
  }
});

onMounted(async () => {
  checkSearchNameList()
  searchName.value = route.query.searchName
  document.addEventListener('click', handleClickOutside);
  steamId.value = route.query.steamId
})

const handleClickOutside = (event) => {
  // 检查点击是否发生在collapse外
  if (!event.target.closest('.el-collapse')) {
    activeNames.value = []; // 折叠所有项
  }
};
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toSearchBtn = async () => {
  NProgress.start()
  setSearchName(searchName.value)
  await getPubgUserPlayer({
    'platform': platform.value,
    'searchName': searchName.value,
  }).then((result) => {
    NProgress.done()
    setTimeout(() => {
      pubgUserPlayerStore.setPubgUserPlayer(result.data)
      router.push({
        path: '/query/player-query',
        query: {searchName: searchName.value, platform: platform.value, accountId: result.data.id}
      }).then(() => {
        location.reload()
      });
    }, 300);
  }).catch((err) => {
    NProgress.done()
  });
  ;
}
const deleteSearchName = (index) => {
  searchNameList.value = searchNameList.value.filter((_, i) => i !== index)
  deleteSearchNameByIndex(index)
  checkSearchNameList()
}

const checkSearchNameList = () => {
  searchNameList.value = getSearchName()

  if (typeof searchNameList.value?.length === 'undefined' || searchNameList.value?.length === 0) {
    searchNameList_isno.value = true
  } else {
    searchNameList_isno.value = false
  }
}
const search = (data) => {
  searchName.value = data
  toSearchBtn()
}

const vacBtn =()=>{
  if(steamId.value.length!=17){
    ElMessage.error('SteamID为17位，请检查后再进行查询！')
  }else{
    router.push({path:'/vac-query/steam-info', query:{steamId:steamId.value}}).then(()=>{
    location.reload()
  })
  }

}

</script>

<template>
  <div class="search_div">
    <div class="search_img">
      <div class="search_img_div">
        <img src="../assets/query-bg.png" alt="">
        <div class="search_img_bottom"></div>
      </div>
    </div>
    <div class="search">
      <div v-if="!showOnline && isPubgSearch" class="search_input">
        <div class="search_platform">
          <div class="platform_btn" :class="{platform_btn_visited:platform==='steam'}" @click="platform='steam'">
            Steam
          </div>
          <div class="platform_btn" :class="{platform_btn_visited:platform==='kakao'}" @click="platform='kakao'">
            KaKao
          </div>
          <p>微信公众号：音速电玩</p>
        </div>
        <div class="search_input_div">
          <el-collapse v-model="activeNames" accordion style="width: 100%" @click.native="handleClickOutside">
            <el-collapse-item title="Consistency" name="1">
              <template #title>
                <input type="text" placeholder="请输入你的游戏昵称(注意大小写)" v-model="searchName">
                <button class="search_btn" @click="toSearchBtn">开始搜索</button>
              </template>
              <template #icon="{ isActive }">
                <span style="display: none">
                  {{ isActive ? 'Expanded' : 'Collapsed' }}
                </span>
              </template>
              <el-row style="z-index: 999 !important;">
                <el-col :span="24" v-show="!searchNameList_isno">
                  <el-row>
                    <el-col :span="24" style="padding-bottom: 0; font-size: 16px; padding: 10px;">
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
      <div v-if="showOnline" class="pubg_count">
        <p>
          PUBG当前在线玩家人数：<span>{{ onlineUsers }}</span>
        </p>
      </div>
      <div v-if="isVacSearch" class="var_query">
        <div class="var_query_title">VAC封禁查询</div>
        <div class="var_query_help">如何获取Steam17位ID？</div>
        <div class="var_query_input_div">
          <input type="text" placeholder="输入Steam17位Id或者库存URL" v-model="steamId">
          <el-button type="primary" @click="vacBtn()">开始搜索</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.var_query_input_div input:focus {
  outline: none; /* 去掉焦点时的黑色边框 */

}

.var_query_input_div input::placeholder {
  color: #99a9bf;
  font-weight: bold;
}

.var_query_input_div input {
  width: 500px;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: bold;
  padding-left: 10px;
}

.el-button {
  height: 100%; /* 设置按钮高度 */
}

.var_query_input_div {
  display: flex;
  gap: 5px;
  margin-top: 20px;
  height: 50px;
}

.var_query_help {
  cursor: pointer;
  font-size: 18px;
  color: #ffffffcc !important;
}

.var_query_title {
  font-size: 40px;
  font-weight: 500;
}

.var_query {
  display: flex;
  flex-direction: column;
  color: white;
  text-align: center;
}

.pubg_count {
  color: white;
  font-size: 20px;
}

.pubg_count span {
  font-size: 28px;
  color: rgb(244, 207, 58);
}

.search_input_div input {
  font-size: 16px;
  height: 100%;
  margin-left: 7px;
  flex: 3;
  border: none;
  outline: none;
  z-index: 999 !important;
}

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
  padding: 10px;
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

.avatar img {
  width: 90%;
  border-radius: 50%;
  border: 4px solid white;
}


.search_img_bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(180deg, #fff0, #fff);
}

.search_div {
  position: relative;

}

.search_img {
  width: 100%;
  overflow: hidden;
}

.search_img_div {
  position: relative;
  height: 350px
}

.search_img img {
  object-position: top;
  object-fit: cover;
  width: 100%;
  height: 350px;
  max-width: 100%;
}

.search {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.search_log img {
  height: auto;
  /* 保持图片的宽高比 */
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

@media screen and (max-width: 768px) {
  .pubg_count {
    font-size: 18px;
  }

  .search_img img {
    position: relative;
    width: 200%;
  }

  .search_log img {
    width: 150px;
  }

  .search_input {
    width: 90vw;
  }

  .avatar img {
    width: 60%;
    border-radius: 50%;
    border: 4px solid white;
  }

  .var_query_input_div input {
    width: 70vw;
  }

}

</style>
