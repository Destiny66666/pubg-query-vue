<script setup>
  import { Histogram, List, Grid, ArrowRightBold } from '@element-plus/icons-vue'
  import { getPubgSeasons, getPubgSeasonsData, getPubgSeasonsRankedData, getPubgMatchesData ,getPubgUserPlayer} from "@/api/pubgApis.js";
  import { onMounted, ref, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { Icon } from '@iconify/vue';
  import { pubgUserMatches } from "@/stores/pubgUserMatches.js";
  import { pubgUserPlayer } from "@/stores/pubgUserPlayer.js";
  import NProgress from 'nprogress'
  import 'nprogress/nprogress.css'

  const pubgUserPlayerInfo = ref()
  const router = useRouter()
  const pubgUserPlayerStore = pubgUserPlayer()
  const pubgUserMatchesStore = pubgUserMatches()
  const route = useRoute()
  const seasons = ref({})
  const seasonId = ref('')
  const currentTier = ref()
  const currentRankPoint = ref()
  const mode = ref('TPP')
  const isRanded = ref(true)
  const seasonData = ref({})
  const seasonDataTotal = ref({})
  const isData = ref(true)
  const seasonRankedData = ref({})
  const isCheckSwitchMode = ref(1)
  const page = ref(1)
  const pubgMatchesData = ref()
  const matchesCount = ref()
  const totalPage = ref()
  const isLoading = ref(false);
  const noMatchesData = ref(false)
  const noMatches = ref(false)

  const pubgSeasons = async () => {
    const result = await getPubgSeasons()
    for (let key in result.data) {
      if (result.data[key].platform === route.query.platform) {
        seasons.value = result.data[key].seasons
        seasonId.value = result.data[key].seasons[0].season_id
      }
    }
    await getSeasonsRankedData()
    await getSeasonsData()
    if(!(pubgUserMatchesStore.matches.length === 0)){
      await getPubgMatches()
      await getPubgMatches()
      matchesCount.value = pubgUserMatchesStore.matches.length
      totalPage.value = Math.ceil(matchesCount.value / 5);
    }else{
      noMatches.value = true
    }

  }

  const getCharAfterLastDash = (str) => {
    const parts = str.split('-');
    return '第' + parts.pop() + '赛季';
  }

  const switchSeason = (season_id) => {
    if (season_id === seasonId.value ){
      return
    }
    seasonId.value = season_id
    getSeasonsRankedData()
    getSeasonsData()
    isCheckSwitchMode.value = 1
    mode.value = 'TPP'
    isRanded.value = true
  }

  const getSeasonsRankedData = async () => {
    const result = await getPubgSeasonsRankedData({
      "platform": route.query.platform,
      "accountId": route.query.accountId,
      "seasonId": seasonId.value
    })
    seasonRankedData.value = result.data
    seasonDataTotal.value = seasonRankedData.value.tpp?.squad
    isShow()
    currentTier.value = result.data.tpp.squad?.currentTier
    currentRankPoint.value = result.data.tpp.squad?.currentRankPoint
  }
  const isShow = () => {
    isData.value = typeof seasonDataTotal.value !== "undefined";
  }
  const getSeasonsData = async () => {
    const result = await getPubgSeasonsData({
      "platform": route.query.platform,
      "accountId": route.query.accountId,
      "seasonId": seasonId.value
    })
    seasonData.value = result.data
  }

  const toFixed = (num) => {
    let roundedNum = Math.round(num * 100) / 100;
    return roundedNum.toFixed(2);
  }

  onMounted(() => {
    pubgSeasons()
    if (typeof route.query?.searchName == 'undefined' || typeof route.query?.accountId == 'undefined' || typeof route.query?.platform == 'undefined') {
      router.push('/')
    }
  })

  const checkMatch = (match, mode) => {
    if (match === '排位') {
      if (mode === 'TPP') {
        seasonDataTotal.value = seasonRankedData.value.tpp?.squad
      } else {
        seasonDataTotal.value = seasonRankedData.value?.fpp['squad-fpp']
      }
      isRanded.value = true
    } else {
      if (mode === 'TPP') {
        seasonDataTotal.value = seasonData.value.tpp.total
      } else {
        seasonDataTotal.value = seasonData.value.fpp.total
      }
      isRanded.value = false
    }
    isShow()
  }
  const switchMode = (team, mode) => {
    if (team === 'total') {
      isCheckSwitchMode.value = 1
      if (mode === 'TPP') {
        seasonDataTotal.value = seasonData.value.tpp.total
      } else {
        seasonDataTotal.value = seasonData.value.fpp.total
      }
    }
    if (team === 'solo') {
      isCheckSwitchMode.value = 2
      if (mode === 'TPP') {
        seasonDataTotal.value = seasonData.value.tpp.modes.solo
      } else {
        seasonDataTotal.value = seasonData.value.fpp.modes['solo-fpp']
      }
    }
    if (team === 'duo') {
      isCheckSwitchMode.value = 3
      if (mode === 'TPP') {
        seasonDataTotal.value = seasonData.value.tpp.modes.duo
      } else {
        seasonDataTotal.value = seasonData.value.fpp?.modes['duo-fpp']
      }
    }
    if (team === 'squad') {
      isCheckSwitchMode.value = 4
      if (mode === 'TPP') {
        seasonDataTotal.value = seasonData.value.tpp.modes?.squad
      } else {
        seasonDataTotal.value = seasonData.value.fpp?.modes['squad-fpp']
      }
    }
    isShow()
  }
  const checkMode = (data) => {
    if (data === 'TPP') {
      mode.value = 'TPP'
      currentTier.value = seasonRankedData.value.tpp.squad?.currentTier
      currentRankPoint.value = seasonRankedData.value.tpp.squad?.currentRankPoint
      isCheckSwitchMode.value = 1
      checkMatch('排位', mode.value)
    } else {
      currentTier.value = seasonRankedData.value.fpp['squad-fpp']?.currentTier
      currentRankPoint.value = seasonRankedData.value.fpp['squad-fpp']?.currentRankPoint
      mode.value = 'FPP'
      isCheckSwitchMode.value = 1
      checkMatch('排位', mode.value)
    }
    isShow()
  }



  const getPubgMatches = async () => {
    isLoading.value = true
    const result = await getPubgMatchesData({
      "platform": route.query.platform,
      "accountId": route.query.accountId,
      "page": page.value,
      "matches": pubgUserMatchesStore.matches
    }).then((result) => {
      if (page.value === 1) {
        pubgMatchesData.value = result.data
      } else {
        pubgMatchesData.value.push(...result.data)
      }
      page.value++
      isLoading.value = false
    }).catch((err) => {
      isLoading.value = false
    });;

  }
  const showTier = (tier) => {
    switch (tier) {
      case 'Bronze':
        return '黄铜' + convertToChineseNumber(currentTier.value?.subTier)
      case 'Silver':
        return '白银' + convertToChineseNumber(currentTier.value?.subTier)
      case 'Gold':
        return '黄金' + convertToChineseNumber(currentTier.value?.subTier)
      case 'Platinum':
        return '铂金' + convertToChineseNumber(currentTier.value?.subTier)
      case 'Diamond':
        return '钻石' + convertToChineseNumber(currentTier.value?.subTier)
      case 'Master':
        return '大师' + convertToChineseNumber(currentTier.value?.subTier)
      default:
        break;
    }
  }
  function convertToChineseNumber(num) {
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (num < 10) {
      return chineseNumbers[num - 1];
    }

  }
  const tierImgUrl = computed(() => {
    return currentTier.value?.tier ? '/tier/' + currentTier.value?.tier + '_' + currentTier.value?.subTier + '.png' : '/tier/none.png'
  })

  const survivalImgUrl = computed(() => {
    return new URL('/tier/tier_' + pubgUserPlayerStore.pubgUserPlayer.tier + '.png', import.meta.url).href
  })
  console.log(import.meta.url)
  const showBanType = (data) => {
    switch (data) {
      case 'Innocent':
        return '正常'
      case 'TemporaryBan':
        return '临时封禁'
      case 'PermanentBan':
        return '永久封禁'
      default:
        break;
    }
  }
  const toggleContent = (contentId, matchesId) => {
    var content = document.getElementById(contentId);
    content.classList.toggle("show");

    var matches = document.getElementById(matchesId);
    matches.classList.toggle("show");
  }


  let timeoutId;
  const handleScroll = (event) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        if (page.value > totalPage.value) {
          noMatchesData.value = true
          return
        }
        if (!isLoading.value) {
          await getPubgMatches()
        }
      }
    }, 1000); // 防抖延迟
  };

  const overallRanking = (data) => {
    console.log(data)
    router.push({
      path: '/query/team-list', query: {
        "matchesId": data.matchesId,
        "platform": route.query.platform,
        "accountId": route.query.accountId,
        "searchName":route.query.searchName
      }
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
  const search = async(data) => {
    NProgress.start()
    const result = await getPubgUserPlayer({
      'platform': route.query.platform,
      'searchName': data,
    }).then((result) => {

      NProgress.done()
      setTimeout(() => {
        pubgUserPlayerStore.setPubgUserPlayer(result.data)
        const routeData = router.resolve({
          path: '/query/player-query',
          query: { searchName: data, platform: route.query.platform, accountId: result.data.id }
        })
        window.open(routeData.href, '_blank');
      }, 300);
    }).catch((err) => {
      NProgress.done()
    });;
  }
</script>

<template>
  <el-row class="mode" type="flex" justify="space-between" gutter="">
    <el-col :span="12" class="mode_item " :class="{mode_item_check:mode === 'TPP'}" @click="checkMode('TPP')">
      <span>TPP</span></el-col>
    <el-col :span="12" class="mode_item" :class="{mode_item_check:mode === 'FPP'}" @click="checkMode('FPP')">
      <span>FPP</span></el-col>
  </el-row>
  <el-row class="player">
    <el-col :xs="24" :sm="24" :md="24" :lg="2" :xl="2">
      <el-row class="seasons" type="flex">
        <el-col :xs="8" :sm="8" :md="8" :lg="24" :xl="24" class="seasons_item"
          :class="{seasons_item_check : item.season_id == seasonId}" v-for="(item, index) in seasons" :key="item.id"
          @click="switchSeason(item.season_id)">
          {{ getCharAfterLastDash(item.season_id) }}
        </el-col>
      </el-row>
    </el-col>
    <el-row class="player_info">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-row class="player_info_row">
          <el-col :span="24" class="matchs">
            <span class="match" @click="checkMatch('匹配',mode)" :class="{match_check : !isRanded}">匹配</span>
            <span class="match" @click="checkMatch('排位',mode)" :class="{match_check : isRanded}">排位</span>
          </el-col>
          <el-col :span="24" class="abc" v-show="!isRanded">
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
              <span>数据预览</span>
            </div>
            <el-row class="player_info_grade" justify="center">
              <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="player_info_grade_col" v-show="isRanded">
                <div class="player_info_grade_item">
                  <img :src="tierImgUrl" class="tier_img" alt="">
                  <div class="player_info_grade_item_font">
                    <div class="player_info_grade_item_font_top">
                      {{showTier(currentTier?.tier)}}
                    </div>
                    <div class="player_info_grade_item_font_bottom" v-show="currentRankPoint">
                      {{currentRankPoint}}
                      RP
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="player_info_grade_col">
                <div class="player_info_grade_item">
                  <div class="player_info_grade_item_left">生存等级:</div>
                  <img :src="survivalImgUrl" alt="" class="grade_img">
                  <div class="player_info_grade_item_right"> LV.{{pubgUserPlayerStore.pubgUserPlayer.level }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8" class="player_info_grade_col">
                <div class="player_info_state">
                  <div class="player_info_state_left">账号状态：</div>
                  <div class="player_info_state_right"
                    :class="{type_red:showBanType(pubgUserPlayerStore.pubgUserPlayer.attributes?.banType)==='永久封禁', type_orange:showBanType(pubgUserPlayerStore.pubgUserPlayer.attributes?.banType)==='临时封禁'}">
                    {{showBanType(pubgUserPlayerStore.pubgUserPlayer.attributes?.banType)}}
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
                  <div>{{
                    isRanded ? toFixed((seasonDataTotal?.kills / seasonDataTotal?.deaths)) : seasonDataTotal?.KD
                    }}
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_green">
                <div class="match_data_bg_green_div">
                  <div>K/D/A</div>
                  <div>{{ isRanded ? toFixed(seasonDataTotal?.kda) : seasonDataTotal?.KDA }}</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_green">
                <div class="match_data_bg_green_div">
                  <div>前十率</div>
                  <div>{{
                    isRanded ? toFixed(seasonDataTotal?.top10Ratio * 100) : toFixed(seasonDataTotal?.Top10Rate * 100)
                    }}%
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_green">
                <div class="match_data_bg_green_div">
                  <div>吃鸡率</div>
                  <div>{{
                    isRanded ? toFixed((seasonDataTotal?.wins / seasonDataTotal?.roundsPlayed) * 100) :
                    toFixed(seasonDataTotal?.WinRate * 100)
                    }}%
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-row class="match_total">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
                <div class="match_data_bg_white_div">
                  <div>场次</div>
                  <div>{{ seasonDataTotal?.roundsPlayed }}</div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
                <div class="match_data_bg_white_div">
                  <div>吃鸡</div>
                  <div>{{ seasonDataTotal?.wins }}</div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
                <div class="match_data_bg_white_div">
                  <div>助攻</div>
                  <div>{{ seasonDataTotal?.assists }}</div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
                <div class="match_data_bg_white_div">
                  <div>击杀</div>
                  <div>{{ seasonDataTotal?.kills }}</div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col v-show="isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-row class="match_total">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
                <div class="match_data_bg_white_div">
                  <div>失败</div>
                  <div>{{ isRanded ? seasonDataTotal?.deaths : seasonDataTotal?.losses }}</div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white" v-show="isRanded">
                <div class="match_data_bg_white_div">
                  <div>场均排名</div>
                  <div>{{ isRanded ? toFixed(seasonDataTotal?.avgRank) : 123 }}</div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white" v-show="!isRanded">
                <div class="match_data_bg_white_div">
                  <div>前十</div>
                  <div>{{ isRanded ? seasonDataTotal?.avgRank : seasonDataTotal.top10s }}</div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
                <div class="match_data_bg_white_div">
                  <div>总伤害</div>
                  <div>
                    {{ toFixed(seasonDataTotal?.damageDealt) }}
                  </div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="match_data_bg_white">
                <div class="match_data_bg_white_div">
                  <div>场均伤害</div>
                  <div>
                    {{
                    seasonDataTotal?.damageDealt ? toFixed(seasonDataTotal?.damageDealt / seasonDataTotal?.roundsPlayed)
                    : 0
                    }}
                  </div>
                  <div class="match_data_bg_white_div__border_bottom"></div>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col v-show="!isData" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"
            style="height: 140px; display: flex; justify-content: center; align-items: center; flex-direction: column">
            <Icon icon="solar:confounded-square-linear" width="40px" style="color: #449dd5" />
            <div>当前没数据</div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="matches_col">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div class="match_data_1">
              <el-icon :size="30" color="#409efc">
                <List />
              </el-icon>
              <span>对局记录</span>
            </div>
            <el-row v-show="!noMatches" class="matches" @scroll="handleScroll">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-for="(item, index) in pubgMatchesData"
                :key="index">
                <el-row class="matches_item" :id="'matches_item'+index"
                  :class="{matches_item_is_first:item.my_team.myInfo.winPlace===1}">
                  <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">
                    <div class="matches_item_teamRank">
                      <p>{{item.my_team.myInfo.winPlace}}</p>{{showTeamRank(item.my_team.myInfo.winPlace)}}
                    </div>
                  </el-col>
                  <el-col :xs="9" :sm="3" :md="4" :lg="4" :xl="4">
                    <div class="matches_item2">
                      <div>{{item.matches_info.mapName}}</div>
                      <div>{{item.matches_info.matchType}}{{item.matches_info.gameMode}}</div>
                    </div>
                  </el-col>
                  <el-col :xs="0" :sm="5" :md="6" :lg="6" :xl="7">
                    <div class="matches_createdAt">
                      {{item.matches_info.createdAt}}
                    </div>
                  </el-col>
                  <el-col :xs="0" :sm="3" :md="2" :lg="2" :xl="3">
                    <div class="matches_myInfo">
                      <div>存活时间</div>
                      <div>{{item.my_team.myInfo.timeSurvived}}</div>
                    </div>
                  </el-col>
                  <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">
                    <div class="matches_myInfo">
                      <div>伤害</div>
                      <div>{{item.my_team.myInfo.damageDealt}}</div>
                    </div>
                  </el-col>
                  <el-col :xs="3" :sm="2" :md="2" :lg="2" :xl="2">
                    <div class="matches_myInfo">
                      <div>击杀</div>
                      <div>{{item.my_team.myInfo.kills}}</div>
                    </div>
                  </el-col>
                  <el-col :xs="6" :sm="7" :md="6" :lg="6" :xl="4" class="matches_myInfo_btn">
                    <el-row>
                      <el-col :xs="0" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-button type="primary"
                          @click="toggleContent('content'+index,'matches_item'+index)">队伍详情</el-button>
                      </el-col>
                      <el-col :xs="12" :sm="0" :md="0" :lg="0" :xl="0" style=" text-align: right;">
                        <el-icon :size="24" color="#409efc"
                          @click="toggleContent('content'+index,'matches_item'+index)">
                          <Grid />
                        </el-icon>
                      </el-col>
                      <el-col :xs="0" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-button type="primary" @click="overallRanking(item)">全场排名</el-button>
                      </el-col>
                      <el-col :xs="12" :sm="0" :md="0" :lg="0" :xl="0" style="padding-left: 10px; text-align: left;">
                        <el-icon :size="24" color="#409efc" @click="overallRanking(item)">
                          <ArrowRightBold />
                        </el-icon>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :xs="24" :sm="0" :md="0" :lg="0" :xl="0" class="time"> 2024-10-26 15:39:49
                  </el-col>
                </el-row>
                <el-row class="content" :id="'content'+index">
                  <el-col :span="24" class="detailed_data_name">详细数据</el-col>
                  <el-col :span="24" class="detailed_data_br"></el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-row class="detailed_data">
                      <el-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>伤害</div>
                          <div>{{item.my_team.myInfo.damageDealt}}</div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>击杀数</div>
                          <div>
                            {{item.my_team.myInfo.kills}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>爆头</div>
                          <div>
                            {{item.my_team.myInfo.headshotKills}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>助攻</div>
                          <div>
                            {{item.my_team.myInfo.assists}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>最远击杀</div>
                          <div>
                            {{toFixed(item.my_team.myInfo.longestKill)}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>治疗数</div>
                          <div>
                            {{item.my_team.myInfo.heals}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-row class="detailed_data">
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>连杀</div>
                          <div>{{item.my_team.myInfo.killStreaks}}</div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>存活时间</div>
                          <div>
                            {{item.my_team.myInfo.timeSurvived}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>步行距离</div>
                          <div>
                            {{toFixed(item.my_team.myInfo.walkDistance)}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>驾驶距离</div>
                          <div>
                            {{toFixed(item.my_team.myInfo.rideDistance)}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>游泳距离</div>
                          <div>
                            {{toFixed(item.my_team.myInfo.swimDistance)}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                      <el-col :xs="0" :sm="24" :md="24" :lg="24" :xl="24" class="detailed_data_bg_white">
                        <div class="detailed_data_div">
                          <div>拿起武器</div>
                          <div>
                            {{item.my_team.myInfo.weaponsAcquired}}
                          </div>
                          <div class="match_data_bg_white_div__border_bottom"></div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="24" style="padding: 0 5px;">
                    <el-row class="team_data">
                      <el-col :span="8">
                        队伍数据
                      </el-col>
                      <el-col :span="4" class="team_data_right">
                        击杀
                      </el-col>
                      <el-col :span="4" class="team_data_right">
                        助攻
                      </el-col>
                      <el-col :span="4" class="team_data_right">
                        伤害
                      </el-col>
                      <el-col :span="4" class="team_data_right">
                        存活时间
                      </el-col>
                    </el-row>
                    <el-row v-for="(value, key) in item.my_team.team_players.player" class="team_player_item">
                      <el-col :span="8">
                        <div class="ellipsis" @click="search(value.name)">{{value.name}}</div>
                      </el-col>
                      <el-col :span="4" class="font_color team_data_right">
                        {{value.kills}}
                      </el-col>
                      <el-col :span="4" class="font_color team_data_right">
                        {{value.assists}}
                      </el-col>
                      <el-col :span="4" class="font_color team_data_right">
                        {{value.damageDealt}}
                      </el-col>
                      <el-col :span="4" class="font_color team_data_right">
                        {{value.timeSurvived}}
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
              <el-col class="data_container" :class="{data_container_no: noMatchesData==true}" :span="24"
                v-loading="isLoading">
              </el-col>
              <el-col :span="24" v-show="noMatchesData" class="noMatchesData">
                <Icon icon="mingcute:sob-line" width="48" height="48" style="color: #449dd5" />
                别往下滑了 没数据啦
              </el-col>
            </el-row>
            <el-row>
              <el-col v-show="noMatches" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"
                      style="height: 140px; display: flex; justify-content: center; align-items: center; flex-direction: column">
                <Icon icon="solar:confounded-square-linear" width="40px" style="color: #449dd5" />
                <div>当前没数据</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<style scoped>
  .team_data_right{
    text-align: right;
  }
  .data_container_no {
    display: none;
  }

  .noMatchesData {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .data_container {
    min-height: 50px;
    margin-top: 10px;
  }

  .ellipsis {
    cursor: pointer;
  }

  .ellipsis:hover {
    color: #0099ff;
  }

  .font_color {
    color: rgb(80, 76, 76);
  }

  .team_player_item {
    border: 1px solid rgb(141, 134, 134);
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .team_data {
    margin-top: 10px;
    margin-bottom: 5px;
    color: rgb(80, 76, 76)
  }

  .detailed_data_br {
    height: 1px;
    background-color: rgb(80, 76, 76);
  }

  .detailed_data_name {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 18px;
    color: rgb(80, 76, 76);

  }

  .detailed_data_bg_white {
    border: 1px solid #bfb9b9;
    border-radius: 10px;
  }

  .detailed_data_div {
    color: rgb(80, 76, 76);
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 70px;
    padding: 5px 20px;
    font-weight: 700;
  }

  .detailed_data {
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 15px;

    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 20px;
  }

  .time {
    position: absolute;
    font-size: 14px;
    right: 0;
    bottom: 0;
  }

  /* 折叠内容初始状态 */
  .content {
    margin-top: -2px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    margin-bottom: 20px;
    margin-left: 10px;
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    background: rgba(144, 147, 153, 0.2);
  }

  .matches_item.show {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  /* 展开状态 */
  .content.show {
    max-height: 500px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    /* 控制展开的高度 */
  }

  .toggle-button {
    height: 100px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-bottom: 10px;
  }

  .toggle-button:hover {
    background-color: #2980b9;
  }


  .type_red {
    color: red !important;
  }

  .type_orange {
    color: orange !important;
  }

  .matches_item_is_first {
    background: rgba(230, 162, 60, 0.533) !important;
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

  .matches_myInfo_btn {
    line-height: 100px;
    text-align: center;
  }

  .matches_myInfo {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    font-size: 20px;
  }

  .matches_createdAt {
    line-height: 100px;
    text-align: center;
    font-size: 20px;
    font-weight: 100;
  }

  .matches_item2 {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  }

  .matches_item2 div:nth-child(2) {
    font-size: 22px;
  }

  .matches_item_teamRank p {
    margin: 0 10px 0 0;
    font-weight: 800;
    font-size: 50px;
  }

  .matches_item_teamRank {
    font-style: italic;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .matches_item {
    color: #383838dd;
    background: rgba(144, 147, 153, 0.2);
    height: 100px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 5px;
    display: flex;
  }

  .matches {
    width: 100%;
    height: 600px;
    max-height: 600px;
    margin-top: 20px;
    overflow-y: auto;
  }

  .matches_col {
    margin-top: 20px;
    background-color: rgb(248 248 248);
    box-shadow: 0 3px 5px #0000001a;
    border-radius: 10px;
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

  .player_info_grade_item_font {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .grade_img {
    width: 100px;
  }

  .tier_img {
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

  .match_check {
    color: white;
    background: rgb(64, 158, 255);
  }

  .match {
    text-align: center;
    display: inline-block;
    width: 90px;
    line-height: 40px;
    border-radius: 5px;
    cursor: pointer;
  }

  .matchs {
    padding: 10px;
    height: 60px;
  }

  .player_info {
    flex: 1 1 0%;
    display: flex;
    align-content: flex-start;


  }

  .player {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
  }

  .seasons_item_check {
    border-radius: 5px;
    color: white;
    background: rgb(64, 158, 255);
  }

  .seasons .el-col {
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 5px;
  }

  .seasons {
    background-color: rgb(248 248 248);
  }

  .seasons_item {
    text-align: center;
    cursor: pointer;
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
    .ellipsis {
      width: 80%;
      white-space: nowrap;
      /* 确保文本在一行内显示 */
      overflow: hidden;
      /* 隐藏超出容器的文本 */
      text-overflow: ellipsis;
      /* 使用省略号表示被截断的文本 */
    }

    .detailed_data {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .content {
      margin-bottom: 15px;
    }

    .seasons {
      max-height: 70px;
      overflow-y: auto;
    }

    .match_data_bg_green_div {
      font-size: 16px;
    }

    .player_info_grade_item {
      font-size: 16px;
    }

    .matches_myInfo {
      font-size: 16px;
    }

    .tier_img {
      width: 30%;
    }

    .grade_img {
      width: 60px;
    }

    .player_info_state {
      font-size: 16px;
    }

    .match_total {
      gap: 5px;
      font-size: 16px;
    }

    .match_data_bg_white_div {
      padding: 5px 10px;
      font-size: 12px;
      height: 40px;
    }

    .matches_createdAt {
      font-size: 14px;
    }

    .matches_item_teamRank {
      font-size: 14px;
    }

    .matches_item2 {
      font-size: 14px;
      margin-left: 15px;
    }

    .matches_item2 div:nth-child(2) {
      font-size: 16px;
    }

    .matches_item_teamRank p {
      margin-left: 5px;
      margin-right: 0;
      font-size: 30px;
    }

    .matches_item {
      height: 100px;
    }

    .matches_myInfo {
      font-size: 14px;
    }

    .detailed_data_div {
      font-size: 14px;
      padding: 5px 10px;
      height: 50px;
    }

    .team_player_item {
      font-size: 12px;
    }

    .team_data {
      font-size: 12px;
    }

  }


  @media screen and (min-width: 768px) and (max-width: 992px) {
    .team_player_item {
      font-size: 14px;
    }

    .team_data {
      font-size: 14px;
    }

    .tier_img {
      width: 80px;
    }

    .grade_img {
      width: 80px;
    }

    .matches_myInfo {
      font-size: 14px;
    }

    .matches_createdAt {
      font-size: 14px;
    }

    .matches_item2 {
      font-size: 14px;
    }

    .matches_item2 div:nth-child(2) {
      font-size: 16px;
    }

    .matches_item_teamRank p {
      margin-right: 0;
      font-size: 30px;
    }

    .detailed_data_div {
      font-size: 14px;
      padding: 5px 10px;
    }
  }

  @media screen and (min-width: 993px) and (max-width: 1200px) {
    .tier_img {
      width: 80px;
    }

    .grade_img {
      width: 80px;
    }

    .matches_myInfo {
      font-size: 16px;
    }

    .matches_createdAt {
      font-size: 16px;
    }

    .matches_item2 {
      font-size: 16px;
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
    .matches_myInfo {
      font-size: 16px;
    }

    .matches_createdAt {
      font-size: 16px;
    }

    .matches_item2 {
      font-size: 16px;
    }

    .matches_item2 div:nth-child(2) {
      font-size: 20px;
    }

    .matches_item_teamRank p {
      font-size: 36px;
    }
  }
</style>
