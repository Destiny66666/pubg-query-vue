<script setup>
import {computed, onMounted, ref} from 'vue'
import {getLifeTimeData} from '@/api/pubgApis.js'
import {useRoute, useRouter} from "vue-router";
import {Icon} from "@iconify/vue";
import {Histogram} from "@element-plus/icons-vue";
import {pubgUserPlayer} from "@/stores/pubgUserPlayer.js";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = useRouter();
const route = useRoute();
const pubgUserPlayerStore = pubgUserPlayer()

const isData = ref(true)
const mode = ref('TPP')
const lifeTimeData = ref()
const isCheckSwitchMode = ref(1)

const showData = ref()

const getLifeTime = async () => {
  NProgress.start()
  const result = await getLifeTimeData({
    'platform': route.query.platform,
    'accountId': route.query.accountId,
  })
  NProgress.done()
  lifeTimeData.value = result.data
  showData.value = lifeTimeData.value.tpp?.total
  isShow()
}

onMounted(() => {
  getLifeTime()
})

const survivalImgUrl = computed(() => {
  return '/tier/tier_' + pubgUserPlayerStore.pubgUserPlayer.tier + '.png'
})

const showBanType = (data) => {
  switch (data) {
    case 'Innocent':
      return '正常'
    case 'TemporaryBan':
      return '临时封禁'
    case 'PermanentBan':
      return '永久封禁'
  }
}

const isShow = () => {
  isData.value = typeof showData.value !== "undefined";
}

const toFixed = (num) => {
  let roundedNum = Math.round(num * 100) / 100;
  return roundedNum.toFixed(2);
}

const checkMode = (data) => {
  if (data === 'TPP') {
    mode.value = 'TPP'
    isCheckSwitchMode.value = 1
    checkMatch(mode.value)
  } else {
    mode.value = 'FPP'
    isCheckSwitchMode.value = 1
    checkMatch(mode.value)
  }
  isShow()
}
const checkMatch = (mode) => {
  if (mode === 'TPP') {
    showData.value = lifeTimeData.value.tpp.modes?.squad
  } else {
    showData.value = lifeTimeData.value.fpp?.modes['squad-fpp']
  }
  isShow()
}

const switchMode = (team, mode) => {
  if (team === 'total') {
    isCheckSwitchMode.value = 1
    if (mode === 'TPP') {
      showData.value = lifeTimeData.value.tpp.total
    } else {
      showData.value = lifeTimeData.value.fpp.total
    }
  }
  if (team === 'solo') {
    isCheckSwitchMode.value = 2
    if (mode === 'TPP') {
      showData.value = lifeTimeData.value.tpp.modes.solo
    } else {
      showData.value = lifeTimeData.value.fpp.modes['solo-fpp']
    }
  }
  if (team === 'duo') {
    isCheckSwitchMode.value = 3
    if (mode === 'TPP') {
      showData.value = lifeTimeData.value.tpp.modes.duo
    } else {
      showData.value = lifeTimeData.value.fpp?.modes['duo-fpp']
    }
  }
  if (team === 'squad') {
    isCheckSwitchMode.value = 4
    if (mode === 'TPP') {
      showData.value = lifeTimeData.value.tpp.modes?.squad
    } else {
      showData.value = lifeTimeData.value.fpp?.modes['squad-fpp']
    }
  }
  isShow()
}
</script>

<template>
  <el-row class="mode" type="flex" justify="space-between">
    <el-col :span="12" class="mode_item " :class="{mode_item_check:mode === 'TPP'}" @click="checkMode('TPP')">
      <span>TPP</span></el-col>
    <el-col :span="12" class="mode_item" :class="{mode_item_check:mode === 'FPP'}" @click="checkMode('FPP')">
      <span>FPP</span></el-col>
  </el-row>
  <el-row class="player_info_row">
    <el-col :span="24" class="abc">
      <div class="abc_item" @click="switchMode('total',mode)">
        <div :class="{abc_item_check_border:isCheckSwitchMode===1}"></div>
        <span :class="{abc_item_check:isCheckSwitchMode===1}">总计</span>
      </div>
      <div class="abc_item" @click="switchMode('solo',mode)">
        <div :class="{abc_item_check_border:isCheckSwitchMode===2}"></div>
        <span :class="{abc_item_check:isCheckSwitchMode===2}">单排{{ mode }}</span>
      </div>
      <div class="abc_item" @click="switchMode('duo',mode)">
        <div :class="{abc_item_check_border:isCheckSwitchMode===3}"></div>
        <span :class="{abc_item_check:isCheckSwitchMode===3}">双排{{ mode }}</span>
      </div>
      <div class="abc_item" @click="switchMode('squad',mode)">
        <div :class="{abc_item_check_border:isCheckSwitchMode===4}"></div>
        <span :class="{abc_item_check:isCheckSwitchMode===4}">四排{{ mode }}</span>
      </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data">
      <div class="match_data_1">
        <el-icon :size="30" color="#409efc">
          <Histogram />
        </el-icon>
        <span>终生数据统计[匹配]</span>
      </div>
      <el-row class="player_info_grade" justify="center">
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="player_info_grade_col">
          <div class="player_info_grade_item">
            <div class="player_info_grade_item_left">生存等级:</div>
            <img :src="survivalImgUrl" alt="" class="grade_img">
            <div class="player_info_grade_item_right"> LV.{{ pubgUserPlayerStore.pubgUserPlayer.level }}</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="player_info_grade_col">
          <div class="player_info_state">
            <div class="player_info_state_left">账号状态：</div>
            <div class="player_info_state_right"
                 :class="{type_red:showBanType(pubgUserPlayerStore.pubgUserPlayer.attributes?.banType)==='永久封禁', type_orange:showBanType(pubgUserPlayerStore.pubgUserPlayer.attributes?.banType)==='临时封禁'}">
              {{ showBanType(pubgUserPlayerStore.pubgUserPlayer.attributes?.banType) }}
            </div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_green">
          <div class="match_data_bg_green_div">
            <div>K/D</div>
            <div>{{ showData?.KD }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_green">
          <div class="match_data_bg_green_div">
            <div>K/D/A</div>
            <div>{{ showData?.KDA }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_green">
          <div class="match_data_bg_green_div">
            <div>前十率</div>
            <div>{{ toFixed(showData?.Top10Rate * 100) }}%</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_green">
          <div class="match_data_bg_green_div">
            <div>吃鸡率</div>
            <div>{{ toFixed(showData?.wins / showData?.roundsPlayed) * 100 }}%</div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>击杀</div>
            <div>{{ showData?.kills }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>助攻</div>
            <div>{{ showData?.assists }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>击倒</div>
            <div>{{ showData?.dBNOs }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>造成伤害</div>
            <div>{{ toFixed(showData?.damageDealt) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>场均伤害</div>
            <div>{{ toFixed(showData?.damageDealt / showData?.roundsPlayed) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>前十</div>
            <div>{{ showData?.top10s }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>吃鸡</div>
            <div>{{ showData?.wins }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>失败</div>
            <div>{{ showData?.losses }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>比赛场数</div>
            <div>{{ showData?.roundsPlayed }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>每日击杀</div>
            <div>{{ showData?.dailyKills }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>每日获胜</div>
            <div>{{ showData?.dailyWins }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>周击杀</div>
            <div>{{ showData?.weeklyKills }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>周胜利</div>
            <div>{{ showData?.weeklyWins }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>自杀数</div>
            <div>{{ showData?.suicides }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>游戏天数</div>
            <div>{{ showData?.days }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>爆头击杀</div>
            <div>{{ showData?.headshotKills }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>治疗次数</div>
            <div>{{ showData?.heals }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>救援次数</div>
            <div>{{ showData?.revives }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>乘车距离</div>
            <div>{{ toFixed(showData?.rideDistance) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>创死数(车)</div>
            <div>{{ showData?.roadKills }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>单局击杀</div>
            <div>{{ showData?.roundMostKills }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>比赛场数</div>
            <div>{{ showData?.roundsPlayed }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>游泳距离</div>
            <div>{{ toFixed(showData?.swimDistance) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>队友击杀</div>
            <div>{{ showData?.teamKills }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>载具摧毁</div>
            <div>{{ showData?.vehicleDestroys }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>步行距离</div>
            <div>{{ toFixed(showData?.walkDistance) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>累计存活(秒)</div>
            <div>{{ toFixed(showData?.timeSurvived) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>最长存活(秒)</div>
            <div>{{ toFixed(showData?.longestTimeSurvived) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <el-row class="match_total">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>使用加速道具</div>
            <div>{{ showData?.boosts }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>最远击杀(米)</div>
            <div>{{ toFixed(showData?.longestKill) }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>最高连续击杀</div>
            <div>{{ showData?.maxKillStreaks }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
          <div class="match_data_bg_white_div">
            <div>武器拾取数</div>
            <div>{{ showData?.weaponsAcquired }}</div>
            <div class="match_data_bg_white_div__border_bottom"></div>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-show="!isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"
            style="height: 140px; display: flex; justify-content: center; align-items: center; flex-direction: column">
      <Icon icon="solar:confounded-square-linear" width="40px" style="color: #449dd5"/>
      <div>当前没数据</div>
    </el-col>
  </el-row>
</template>

<style scoped>


.type_red {
  color: red !important;
}

.type_orange {
  color: orange !important;
}


.abc_item_check_border {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 2px;
  background-color: rgb(64, 158, 255);
}

.abc_item_check {
  color: rgb(64, 158, 255);
}

.abc_item {
  cursor: pointer;
  position: relative;
}

.abc {
  margin-top: 10px;
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #e4dbdb;
  padding-left: 5px;
}


.matches_item2 div:nth-child(2) {
  font-size: 22px;
}

.matches_item_teamRank p {
  margin: 0 10px 0 0;
  font-weight: 800;
  font-size: 50px;
}


.match_data_bg_white_div__border_bottom {
  padding-top: 5px;
  border-bottom: 1px solid #bfb9b9;
}

.match_data_bg_white_div {
  font-size: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 70px;
  padding: 5px 20px;
  font-weight: 700;
}

.match_data_bg_white {
  border: 1px solid #bfb9b9;
  border-radius: 10px;
}

.match_data_bg_green_div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 60px;
  width: 100%;

  font-size: 20px;
}

.match_total {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.match_data_bg_green {
  background-color: rgb(103 194 58);
  color: white;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
}

.player_info_state_right {
  color: green;
}

.player_info_state {
  display: flex;
  font-size: 20px;
}

.player_info_row {
  background-color: rgb(248 248 248);
  box-shadow: 0 3px 5px #0000001a;

  border-radius: 10px;
  padding-bottom: 20px;
}

.player_info_grade_col {
  display: flex;
  align-items: center;
  justify-content: center;
}


.grade_img {
  width: 100px;
}


.player_info_grade_item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.player_info_grade_item:nth-of-type(1) {
  gap: 5px;
}

.player_info_grade {
  background-color: #67c23a15;
  height: 150px;

}

.match_data_1:nth-of-type(1) {
  margin-top: 10px;
}

.match_data_1 {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.match_data {
  margin-top: 10px;
}

.seasons .el-col {
  padding-bottom: 5px;
  padding-top: 5px;
  border-radius: 5px;
}

.mode_item_check {
  color: white;
  background: rgb(64, 158, 255);
}

.mode_item {
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  line-height: 35px;
}

.mode {
  width: 100%;
  height: 45px;
  background-color: rgb(248 248 248);
  padding: 5px;
}

* {
  font-weight: 500;
}

@media screen and (max-width: 767px) {

  .match_data_bg_green_div {
    font-size: 16px;
  }

  .player_info_grade_item {
    font-size: 16px;
  }

  .grade_img {
    width: 60px;
  }

  .player_info_state {
    font-size: 16px;
  }

  .match_total {
    gap: 10px;
    margin-top: 10px;
    font-size: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .match_data_bg_white_div {
    padding: 5px 10px;
    font-size: 12px;
    height: 40px;
  }

  .matches_item2 div:nth-child(2) {
    font-size: 16px;
  }

  .matches_item_teamRank p {
    margin-left: 5px;
    margin-right: 0;
    font-size: 30px;
  }

}


@media screen and (min-width: 768px) and (max-width: 992px) {

  .match_total {
    gap: 10px;
    margin-top: 10px;
    font-size: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }


  .grade_img {
    width: 80px;
  }


  .matches_item2 div:nth-child(2) {
    font-size: 16px;
  }

  .matches_item_teamRank p {
    margin-right: 0;
    font-size: 30px;
  }

}

@media screen and (min-width: 993px) and (max-width: 1200px) {

  .grade_img {
    width: 80px;
  }


  .matches_item2 div:nth-child(2) {
    font-size: 20px;
  }

  .matches_item_teamRank p {
    margin-right: 0;
    font-size: 34px;
  }
}

@media screen and (min-width: 1201px) and (max-width: 1470px) {

  .matches_item2 div:nth-child(2) {
    font-size: 20px;
  }

  .matches_item_teamRank p {
    font-size: 36px;
  }
}
</style>
