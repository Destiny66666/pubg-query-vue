<script setup>
  import NavVue from '@/components/Nav.vue'
  import SearchVue from '@/components/Search.vue'
  import { pubgUserPlayer } from "@/stores/pubgUserPlayer.js";
  import {ref, onMounted, onBeforeUnmount } from "vue";
  import { pubgUserMatches } from "@/stores/pubgUserMatches.js";
  import { useRoute, useRouter } from "vue-router";
  import { getPubgUserPlayer } from "@/api/pubgApis.js";
  import { getSearchName, setSearchName, deleteSearchNameByIndex } from "@/util/searchName.js"
  import FooterVue from "@/components/Footer.vue"
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'

  const searchName = ref('')
  const route = useRoute()
  const router = useRouter();
  const pubgUserPlayerStore = pubgUserPlayer()
  const pubgUserMatchesStore = pubgUserMatches()
  const activeNames = ref()
  const pubgUserPlayerInfo = pubgUserPlayerStore.pubgUserPlayer || ''
  const searchNameList_isno = ref(true)
  const searchNameList = ref()
  const select_check = ref()

  searchNameList.value = getSearchName()
  const checkSearchNameList = () => {
    searchNameList_isno.value = searchNameList.value?.length === 0;
  }

  checkSearchNameList()
  onMounted(() => {
    pageInitialization()
    document.addEventListener('click', handleClickOutside);
    select_check.value = route.path
  })

  const pageInitialization = () => {
    if (typeof route.query?.searchName == 'undefined' || typeof route.query?.accountId == 'undefined' || typeof route.query?.platform == 'undefined') {
      router.push('/')
    } else {
      searchBtn()
    }
  }

  const searchBtn = async () => {
    NProgress.start()
    const result = await getPubgUserPlayer({
      'platform': route.query.platform,
      'searchName': route.query.searchName,
    });
    NProgress.done()
    pubgUserPlayerStore.setPubgUserPlayer(result.data)
    pubgUserMatchesStore.setMatches(result.data.matches)
  }

  searchName.value = pubgUserPlayerInfo.attributes?.name

  const handleClickOutside = (event) => {
    // 检查点击是否发生在collapse外
    if (!event.target.closest('.el-collapse')) {
      activeNames.value = []; // 折叠所有项
    }
  };

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  const selectCheck = (data)=>{
    if (select_check.value === data){
      return
    }
    select_check.value = data
    switch (data) {
      case '/query/player-query':
        router.push({path:'/query/player-query', query:{searchName:route.query.searchName, platform:route.query.platform, accountId:route.query.accountId} })
        break
      case '/query/weapon-list':
        router.push({path:'/query/weapon-list', query:{searchName:route.query.searchName, platform:route.query.platform, accountId:route.query.accountId} })
        break
      case '/query/life-time':
        router.push({path:'/query/life-time', query:{searchName:route.query.searchName, platform:route.query.platform, accountId:route.query.accountId} })
        break
    }
  }
</script>
<template>
  <NavVue></NavVue>
  <SearchVue :showOnline="false"></SearchVue>
  <div class="player_info_div">
    <div class="player_info_nav">
      <div class="avatar">
        <img src="../assets/avatar.wd9XgMjl.webp" alt="">
        <span class="player_info_name">{{ route.query?.searchName }}</span>
      </div>
      <div class="select">
        <div class="select_item" @click="selectCheck('/query/player-query')">
          <span :class="{select_check_font:select_check=== '/query/player-query'}">战绩查询</span>
          <div :class="{select_check_bg:select_check=== '/query/player-query'}"></div>
        </div>
        <div class="select_item" @click="selectCheck('/query/weapon-list')">
          <span :class="{select_check_font:select_check==='/query/weapon-list'}">熟练度</span>
          <div :class="{select_check_bg:select_check==='/query/weapon-list'}"></div>
        </div>
        <div class="select_item" @click="selectCheck('/query/life-time')">
          <span :class="{select_check_font:select_check==='/query/life-time'}">终生统计</span>
          <div :class="{select_check_bg:select_check==='/query/life-time'}"></div>
        </div>

      </div>
    </div>
    <el-row type="flex" class="advertisement_el" justify="space-between" gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <img class="advertisement" src="../assets/78044bbe6bf422dd34b175f2dd80bca516b871f8.png" alt="">
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <img class="advertisement" src="../assets/c27dd8b4b0406672695a3c9ef8b927fcdc320b6b.png" alt="">
      </el-col>
    </el-row>
    <router-view></router-view>

  </div>
  <FooterVue></FooterVue>
</template>

<style scoped>
  .select_item{
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .select_check_bg{
    width: 90%;
    height: 2px;
    background-color:  rgb(20, 172, 243);

  }
  .select_check_font {
    color: rgb(20, 172, 243);
    margin-bottom: 3px;
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

  .el-collapse-item__arrow {
    display: none !important;
  }

  .advertisement {
    width: 100%;
    border-radius: 5px;
  }

  .advertisement_el {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .select {
    display: flex;
    margin-top: 30px;
    margin-left: 150px;
    gap: 20px;
    font-size: 20px;
  }

  .player_info_name {
    position: absolute;
    top: 20px;
    left: 140px;
    font-size: 28px;
    font-weight: bold;
    width: 200px;
  }

  .avatar img {
    width: 90%;
    border-radius: 50%;
    border: 4px solid white;
  }

  .avatar {
    top: -80px;
    left: 10px;
    position: absolute;
  }

  .player_info_nav {
    width: 100%;
    height: 70px;
    background-color: rgb(219 219 219);
    box-shadow: 0 0 4px #00000026;
    display: flex;
    position: relative;
  }

  .player_info_div {
    width: 80%;
    margin: 0 auto 20px;
    z-index: 0 !important;
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
    .player_info_div {
      width: 90%;
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

    .avatar {
      top: -40px;
      left: 10px;
      position: absolute;
    }

    .player_info_nav {
      height: 60px;
    }

    .player_info_name {
      font-size: 22px;
      left: 100px;
      top: 10px;
    }

    .select {
      margin-top: 30px;
      font-size: 16px;
      gap: 10px;
      margin-left: 110px;
    }
  }

  @media screen and (max-width: 1200px) {
    .player_info_div {
      width: 90%;
    }
  }
</style>
