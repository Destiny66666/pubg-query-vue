<script setup>
  import { List, UserFilled } from '@element-plus/icons-vue'
  import { onMounted, ref, computed } from 'vue'
  import { getSteamVacData } from "@/api/pubgApis.js";
  import { useRoute, useRouter } from "vue-router";
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const router = useRouter()
  const vacInfo = ref()
  const userInfo = ref()
  const gamesInfo = ref()
  onMounted(() => {
    if (route.query.steamId.length !== 17) {
      ElMessage.error('SteamID为17位，请检查后再进行查询！')
      router.push({ path: '/vac-query' })
    } else {
      getSteamVac()
    }

  })

  const getSteamVac = async () => {
    const result = await getSteamVacData({
      "steamId": route.query.steamId
    })
    vacInfo.value = result.data.vac
    userInfo.value = result.data.user_info
    gamesInfo.value = result.data.game_info
  }

  const selectType = computed(() => {
    return (data) => data === "未封禁" ? "success" : "danger"
  })

  const convertMinutesToHours = (totalMinutes) => {
    if (typeof totalMinutes === 'undefined') {
      return `0 小时`;
    }
    const hours = (totalMinutes / 60).toFixed(2); // 保留两位小数
    return `${hours} 小时`;
  }

  const gameImgUrl = computed(() => {
    return (data) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${data}/header.jpg`
  })
</script>

<template>
  <el-row class="steam_info">
    <el-col :span="24" class="top">
      <div class="avatar">
        <img :src="userInfo?.avatarfull" alt="">
        <span class="steam_name">{{userInfo?.personaname}}</span>
      </div>
    </el-col>

    <el-col :span="24">
      <el-row :xs="0">
        <el-col :xs="0" :sm="8" :md="8" :lg="8" :xl="8" class="user_info_title">
          <el-icon color="#409efc" size="30">
            <UserFilled />
          </el-icon>
          <span>个人信息</span>
        </el-col>
        <el-col :xs="0" :sm="16" :md="16" :lg="16" :xl="16" class="user_info_title">
          <el-icon color="#409efc" size="30">
            <List />
          </el-icon>
          <span>游戏列表</span>
          <span style="margin-left: 10px;">{{gamesInfo?.game_count}}</span>
        </el-col>
      </el-row>
      <el-row class="info">
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" style="padding: 10px;">
          <div class="user_info">
            <div class="user_info_item">
              <div>VAC封禁状态</div>
              <div><el-tag :type="selectType(vacInfo?.VAC封禁)">{{vacInfo?.VAC封禁}}</el-tag></div>
            </div>
            <div class="user_info_item">
              <div>VAC封禁数量</div>
              <div>{{vacInfo?.VAC封禁数量}}</div>
            </div>
            <div class="user_info_item">
              <div>游戏封禁</div>
              <div>{{vacInfo?.游戏封禁的数量}}</div>
            </div>
            <div class="user_info_item">
              <div>已被封禁天数</div>
              <div>{{vacInfo?.已被封禁天数}}</div>
            </div>
            <div class="user_info_item">
              <div>社区封禁</div>
              <div><el-tag :type="selectType(vacInfo?.社区封禁)">{{vacInfo?.社区封禁}}</el-tag></div>
            </div>
            <div class="user_info_item">
              <div>市场封禁</div>
              <div><el-tag :type="selectType(vacInfo?.市场封禁)">{{vacInfo?.市场封禁}}</el-tag></div>
            </div>
            <div class="user_info_item">
              <div>注册时间</div>
              <div>{{vacInfo?.注册时间}}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" style="padding: 10px;">
          <div class="game">
            <div class="game_item" v-for="(item, index) in gamesInfo?.games">
              <img :src="gameImgUrl(item.appid)" alt="">
              <div class="game_item_name">{{item.name}}</div>
              <div class="playtime_2weeks">近两周时长：{{convertMinutesToHours(item.playtime_2weeks)}}</div>
              <div class="playtime_forever">总游戏时长：{{convertMinutesToHours(item.playtime_forever)}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
  .user_info_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .game_item_name {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .game_item img {
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  .game_item {
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 10px;
    --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    border-radius: 10px;
    font-size: 13px;
  }

  .game {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .info_value {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: right;
  }

  .info_name {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .user_info {
    background-color: #90939955;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 10px;
    border-radius: 5px;
    gap: 10px;
  }

  .info {
    margin-top: 10px;
    background-color: rgb(248 248 248);
    --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    border-radius: 5px;
  }

  .user_info_title {
    padding-left: 10px;
    display: flex;
    align-items: center;
    font-weight: 500;
  }

  .steam_name {
    position: absolute;
    margin-left: 10px;
    top: 30px;
    width: 100%;
    font-weight: 700;
    font-size: 28px;
    white-space: nowrap;
  }

  .avatar img {
    width: 130px;
    border-radius: 50%;
    border: 4px solid white;
  }

  .avatar {
    position: absolute;
    left: 20px;
    bottom: 10px;
  }

  .top {
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #90939999;
    height: 70px;
    border-radius: 10px;
    --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
    --tw-ring-offset-shadow: 0 0 #0000;
        --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    position: relative;
  }

  .steam_info {
    width: 80%;
    margin: 0 auto 20px;

  }

  @media screen and (max-width: 767px) {
    .steam_name{
      top: 15px;
      font-size: 24px;
    }
    .avatar{
      left: 10px;
      bottom: 5px;
    }
    .avatar img{
      width: 90px;
    }
    .top{
      height: 50px;
      margin-top: 5px;
      margin-bottom: 5px;
      border-radius: 5px;
    }
    .user_info {
      font-size: 13px;
    }

    .user_info_title {
      display: none;
    }

    .steam_info {
      width: 90%;
    }

    .game {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media screen and (min-width: 768px) and (max-width: 992px) {
    .game {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .steam_info {
      width: 90%;
    }

    .user_info {
      font-size: 13px;
    }
  }

  @media screen and (min-width: 993px) and (max-width: 1200px) {
    .game {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .steam_info {
      width: 90%;
    }

    .game_item {
      font-size: 13px;
    }

  }

  @media screen and (min-width: 1200px) and (max-width: 1500px) {
    .steam_info {
      width: 90%;
    }

    .game_item {
      font-size: 12px;
    }
  }
</style>
