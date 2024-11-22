<script setup>
import NavVue from '@/components/Nav.vue'
import FooterVue from "@/components/Footer.vue"
import SearchVue from "@/components/Search.vue"
import {Icon} from '@iconify/vue';
import {computed, onMounted, ref} from "vue";
import {getLeaderBoardData, getPubgSeasons} from "@/api/pubgApis.js";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const gamePlatform = ref('pc-as')
const gameMode = ref('squad')
const seasonId = ref()
const seasons = ref()
const topThreeData = ref()
const rankData = ref()
const noData = ref(false)

onMounted(() => {
  pubgSeasons()
})

const isData = (data) => {
  if (data.length === 0) {
    noData.value = true
  }else{
    noData.value = false
  }
}

const pubgSeasons = async () => {
  const result = await getPubgSeasons()
  seasons.value = result.data[0].seasons
  seasonId.value = seasons.value[0].season_id
  await getLeaderBoard()
}

const platformCheck = (data) => {
  gamePlatform.value = data
  getLeaderBoard()
}
const gameModeCheck = (data) => {
  gameMode.value = data
  getLeaderBoard()
}
const showPlatformPrimary = (data) => {
  if (data === gamePlatform.value) {
    return 'primary'
  } else {
    return null
  }
}

const showGameModePrimary = (data) => {
  if (data === gameMode.value) {
    return 'primary'
  } else {
    return null
  }
}

const getCharAfterLastDash = (str) => {
  const parts = str.split('-');
  return '第' + parts.pop() + '赛季';
}
const switchSeason = (data) => {
  if (data === seasonId.value) {
    return
  }
  seasonId.value = data
  getLeaderBoard()
}

const getLeaderBoard = async () => {
  NProgress.start()
  const result = await getLeaderBoardData({
    "seasonId": seasonId.value,
    "gamePlatform": gamePlatform.value,
    "gameMode": gameMode.value,
  }).then((result) => {
    NProgress.done()
    isData(result)
    topThreeData.value = result.data.slice(0, 3)
    rankData.value = result.data.slice(3)
  }).catch((error) => {
    isData([])
    NProgress.done()
  })



}

const showTeamRank = (data) => {
  switch (data) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}
const tierImgUrl = computed(() => {
  return (tier, subTier) => '/src/assets/tier/' + tier + '_' + subTier + '.png'
})
</script>

<template>
  <NavVue></NavVue>
  <SearchVue :showOnline="false"></SearchVue>

  <el-row class="leader_board">
    <el-col :span="24">
      <el-row>
        <el-col :span="24" class="game_platform">
          <Icon icon="ant-design:database-outlined" width="28" height="28" style="color: rgb(64, 158, 255)"/>
          <span>服务器</span>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" class="game_platform_check">
      <el-button :type="showPlatformPrimary('pc-as')" @click="platformCheck('pc-as')">亚服</el-button>
      <el-button :type="showPlatformPrimary('pc-eu')" @click="platformCheck('pc-eu')">欧服</el-button>
      <el-button :type="showPlatformPrimary('pc-krjp')" @click="platformCheck('pc-krjp')">日韩服</el-button>
      <el-button :type="showPlatformPrimary('pc-na')" @click="platformCheck('pc-na')">北美服</el-button>
      <el-button :type="showPlatformPrimary('pc-sea')" @click="platformCheck('pc-sea')">东南亚服</el-button>
      <el-button :type="showPlatformPrimary('pc-kakao')" @click="platformCheck('pc-kakao')">kakao服</el-button>
    </el-col>
    <el-col :span="24">
      <el-row>
        <el-col :span="24" class="game_platform">
          <Icon icon="solar:gamepad-outline" width="28" height="28" style="color: #449dd5"/>
          <span>模式</span>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" class="game_platform_check">
      <el-button :type="showGameModePrimary('solo')" @click="gameModeCheck('solo')">单排TPP</el-button>
      <el-button :type="showGameModePrimary('solo-fpp')" @click="gameModeCheck('solo-fpp')">单排FPP</el-button>
      <el-button :type="showGameModePrimary('duo')" @click="gameModeCheck('duo')">双排TPP</el-button>
      <el-button :type="showGameModePrimary('duo-fpp')" @click="gameModeCheck('duo-fpp')">双排FPP</el-button>
      <el-button :type="showGameModePrimary('squad')" @click="gameModeCheck('squad')">四排TPP</el-button>
      <el-button :type="showGameModePrimary('squad-fpp')" @click="gameModeCheck('squad-fpp')">四排FPP</el-button>
    </el-col>
    <el-col :span="24">
      <el-row gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="2" :xl="2">
          <el-row class="seasons" type="flex">
            <el-col :xs="8" :sm="8" :md="8" :lg="24" :xl="24" class="seasons_item"
                    :class="{seasons_item_check : item.season_id == seasonId}" v-for="(item, index) in seasons"
                    :key="item.id"
                    @click="switchSeason(item.season_id)">
              {{ getCharAfterLastDash(item.season_id) }}
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="22" :xl="22" class="rank">
          <el-row>
            <el-col v-show="!noData" :span="24">
              <el-row class="top_three">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="top_three_item"
                        v-for="(item, index) in topThreeData" :key="item.id">
                  <div class="top_three_top">
                    <div class="top_three_rank">
                      {{ item.attributes.rank }}
                      <span>{{ showTeamRank(item.attributes.rank) }}</span>
                    </div>
                    <span class="top_three_name">{{ item.attributes.name }}</span>
                  </div>
                  <div class="top_three_bottom">
                    <div class="top_three_tier">
                      <img :src="tierImgUrl(item.attributes.stats.tier, item.attributes.stats.subTier)" alt="">
                      <span>{{ item.attributes.stats.rankPoints }}RP</span>
                    </div>
                    <div class="top_three_data">
                      <div class="top_three_data_left">
                        <div class="top_three_data_left_data">
                          <span>场次</span>
                          <span>吃鸡</span>
                          <span>场均排名</span>
                        </div>
                        <div class="top_three_data_right_data">
                          <span>{{ item.attributes.stats.games }}</span>
                          <span>{{ item.attributes.stats.wins }}</span>
                          <span>{{ parseFloat(item.attributes.stats.averageRank.toFixed(1)) }}</span>
                        </div>
                      </div>
                      <div class="top_three_data_left">
                        <div class="top_three_data_left_data">
                          <span>击杀</span>
                          <span>KDA</span>
                          <span>场均伤害</span>
                        </div>
                        <div class="top_three_data_right_data">
                          <span>{{ item.attributes.stats.kills }}</span>
                          <span>{{ parseFloat(item.attributes.stats.kda.toFixed(1)) }}</span>
                          <span>{{ parseFloat(item.attributes.stats.averageDamage.toFixed(1)) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col >
            <el-col :span="24" class="rank_data_div">
              <el-row>
                <el-col v-show="!noData">
                  <el-row class="rank_data_title">
                    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">排名</el-col>
                    <el-col :xs="4" :sm="5" :md="5" :lg="5" :xl="5">名称</el-col>
                    <el-col :xs="6" :sm="5" :md="5" :lg="5" :xl="5">段位</el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">场次</el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">吃鸡</el-col>
                    <el-col :xs="0" :sm="2" :md="2" :lg="2" :xl="2">场均排名</el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">击杀</el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">KDA</el-col>
                    <el-col :xs="0" :sm="2" :md="2" :lg="2" :xl="2">场均伤害</el-col>
                  </el-row>
                </el-col>
                <el-col v-show="!noData" class="rank_data">
                  <el-row v-for="(item, index) in rankData" :key="item.id">
                    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">{{ item.attributes.rank }}</el-col>
                    <el-col :xs="4" :sm="5" :md="5" :lg="5" :xl="5" class="rank_data_name">{{ item.attributes.name }}
                    </el-col>
                    <el-col :xs="6" :sm="5" :md="5" :lg="5" :xl="5"
                            style="display: flex; align-items: center; justify-content: center;">
                      <img :src="tierImgUrl(item.attributes.stats.tier, item.attributes.stats.subTier)" alt=""
                           class="rank_tier_img">
                      {{ item.attributes.stats.rankPoints }}RP
                    </el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">{{ item.attributes.stats.games }}</el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">{{ item.attributes.stats.wins }}</el-col>
                    <el-col :xs="0" :sm="2" :md="2" :lg="2" :xl="2">
                      {{ parseFloat(item.attributes.stats.averageRank.toFixed(1)) }}
                    </el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">{{ item.attributes.stats.kills }}</el-col>
                    <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">
                      {{ parseFloat(item.attributes.stats.kda.toFixed(1)) }}
                    </el-col>
                    <el-col :xs="0" :sm="2" :md="2" :lg="2" :xl="2">
                      {{ parseFloat(item.attributes.stats.averageDamage.toFixed(1)) }}
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24" v-show="noData" class="no_data">
                  <Icon icon="solar:confounded-square-linear" width="40px" style="color: #449dd5"/>
                  <div>当前没数据</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <FooterVue></FooterVue>
</template>

<style scoped>
.top_three_name{
  font-weight: 500;
}
.no_data{
  height: 1100px;
  line-height: 1100px;
}
.rank_data_name {
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank_data_title {
  margin-right: 18px;
  margin-bottom: 10px;
}

.rank_tier_img {
  width: 20px;
}

.rank_data {
  max-height: 1100px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rank_data_div {
  max-height: 1200px;
  background-color: #67c23a55;
  text-align: center;
  border-radius: 10px;
  margin-top: 10px;
}

.top_three_data_right_data {
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: right;
  justify-content: space-around;
}

.top_three_data_left_data {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.top_three_data_left {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.top_three_data {
  flex: 5;
  background-color: #90939933;
  box-shadow: 0 0 5px #0000001a;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  gap: 30px;
  padding: 0 15px;
}

.top_three_tier span {
  font-size: 14px;
  font-weight: 500;
}

.top_three_tier img {
  width: 60px;
}

.top_three_tier {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.top_three_bottom {
  display: flex;
}

.top_three_rank span {
  font-size: 20px;
}

.top_three_rank {
  font-size: 36px;
  display: flex;
  align-items: center;
  font-style: italic;
  font-weight: 500;
}

.top_three_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top_three_item {
  background-color: #e6a23c99;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  cursor: pointer;
}

.top_three {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: 100%;
}

.el-button + .el-button {
  border-radius: 0 !important;
  margin-left: 0;
}

.el-button + .el-button:last-of-type {
  border-top-right-radius: 5px !important;
  border-bottom-right-radius: 5px !important;
}

.el-button:first-of-type {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.game_platform span {
  margin-left: 10px;
}

.game_platform {
  display: flex;
  align-items: center;
}

.leader_board {
  margin: -30px auto 20px;
  width: 90%;
  background-color: rgb(248 248 248);
  border-radius: 10px;
  box-shadow: 0 0 5px 1px #0000001a;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.seasons_item {
  text-align: center;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
}

.seasons_item_check {
  border-radius: 5px;
  color: white;
  background: rgb(64, 158, 255);
}

@media screen and (max-width: 767px) {
  .no_data{
    height: 400px;
    line-height: 400px;
  }

  .rank_tier_img {
    width: 16px;
  }
  .rank_data_title {
    margin-top: 5px;
    margin-right: 0;
  }

  .seasons {
    max-height: 90px;
    overflow-y: auto;
  }

  .top_three {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .rank {
    margin-top: 10px;
  }

  .top_three_data {
    font-size: 13px;
    gap: 20px;
  }

  .top_three_tier img {
    width: 50px;
  }

  .top_three_tier span {
    font-size: 14px;
  }

  .rank_data_div {
    font-size: 13px;
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  .top_three {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .seasons {
    max-height: 120px;
    overflow-y: auto;
  }

  .rank {
    margin-top: 10px;
  }

  .top_three_data {
    font-size: 16px;
    gap: 30px;
  }

  .top_three_tier img {
    width: 80px;
  }

  .top_three_tier span {
    font-size: 14px;
  }

  .rank_data_div {
    font-size: 14px;
  }
}

@media screen and (min-width: 993px) and (max-width: 1200px) {
  .seasons {
    max-height: 120px;
    overflow-y: auto;
  }

  .rank {
    margin-top: 10px;
  }

  .top_three_data {
    font-size: 12px;
    gap: 10px;
  }

  .top_three_tier img {
    width: 50px;
  }

  .top_three_tier span {
    font-size: 12px;
  }
}
</style>
