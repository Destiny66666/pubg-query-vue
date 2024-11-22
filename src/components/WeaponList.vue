<script setup>
import {computed, onMounted, ref} from 'vue'
import {getWeaponMasteryData} from '@/api/pubgApis.js'
import {useRoute, useRouter} from "vue-router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const route = useRoute()
const router = useRouter()

const weaponList = ref()
const weaponMasteryInfo = ref()
const weaponSelect = ref('全部')


onMounted(() => {
  getWeaponMastery()
})

const getWeaponMastery = async () => {
  NProgress.start()
  const result = await getWeaponMasteryData({
    'platform': route.query.platform,
    'accountId': route.query.accountId,
  })
  NProgress.done()
  weaponMasteryInfo.value = result.data
  weaponList.value = result.data.weapon_mastery
}

const getWeaponImgUrl = computed(() => {
  return (data) => '/weapon/' + data + '.png'
})

const weaponSelectCheck = (data, index) => {
  console.log(data, index)
  weaponSelect.value = data
  if (data === '全部') {
    weaponList.value = weaponMasteryInfo.value.weapon_mastery
  } else {
    weaponList.value = weaponMasteryInfo.value.trees[index].children
  }

}

</script>

<template>
  <el-row class="weapon">
    <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="2" class="weapon_select">
      <el-row type="flex">
        <el-col :xs="8" :sm="8" :md="8" :lg="24" :xl="24" class="weapon_select_item"
                :class="{weapon_select_check:weaponSelect==='全部'}" @click="weaponSelectCheck('全部')">
          全部
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="24" :xl="24" class="weapon_select_item"
                :class="{weapon_select_check:weaponSelect===item.name}"
                v-for="(item, index) in weaponMasteryInfo?.trees" @click="weaponSelectCheck(item.name, index)">
          {{ item.name }}
        </el-col>
      </el-row>
    </el-col>
    <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="22" class="weapon_list">
      <el-row class="weapon_list_div">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="weapon_list_item"
                v-for="(item, index) in weaponList">
          <el-row class="weapon_list_item_div">
            <el-col :span="24" class="weapon_list_item_top">
              <div class="weapon_list_item_grade">
                <div class="weapon_list_item_grade_left">
                  <div>LVL</div>
                  <div>Tier</div>
                  <div>XP</div>
                </div>
                <div class="weapon_list_item_grade_right">
                  <div>{{ weaponSelect === '全部' ? item.LevelCurrent : item.data.LevelCurrent }}</div>
                  <div>{{ weaponSelect === '全部' ? item.TierCurrent : item.data.TierCurrent }}</div>
                  <div>{{ weaponSelect === '全部' ? item.XPTotal : item.data.XPTotal }}</div>
                </div>
              </div>
              <div class="weapon_list_item_img">
                <img :src="getWeaponImgUrl(weaponSelect==='全部' ? item?.real_name: item?.data.real_name)" alt="">
              </div>
            </el-col>
            <el-col :span="24" class="weapon_list_item_center">
              {{ weaponSelect === '全部' ? item.name :item.data.name}}
            </el-col>
            <el-col :span="24" class="weapon_list_item_bottom">
              <div class="weapon_list_item_bottom_left">
                <div class="weapon_list_item_bottom_left_left">
                  <div>击杀</div>
                  <div>爆头</div>
                  <div>击倒</div>
                </div>
                <div class="weapon_list_item_bottom_left_right">
                  <div>{{ weaponSelect === '全部' ?item.OfficialStatsTotal.Kills :item.data.OfficialStatsTotal.Kills}}</div>
                  <div>{{ weaponSelect === '全部' ?item.OfficialStatsTotal.HeadShots :item.data.OfficialStatsTotal.HeadShots}}</div>
                  <div>{{ weaponSelect === '全部' ?item.OfficialStatsTotal.Groggies :item.data.OfficialStatsTotal.Groggies}}</div>
                </div>
              </div>
              <div class="weapon_list_item_bottom_left">
                <div class="weapon_list_item_bottom_left_left">
                  <div>单局击杀</div>
                  <div>最远击杀</div>
                  <div>造成伤害</div>
                </div>
                <div class="weapon_list_item_bottom_left_right">
                  <div>{{ weaponSelect === '全部' ?item.OfficialStatsTotal.MostKillsInAGame: item.data.OfficialStatsTotal.MostKillsInAGame}}</div>
                  <div>{{ weaponSelect === '全部' ?item.OfficialStatsTotal.LongestKill :item.data.OfficialStatsTotal.LongestKill}}</div>
                  <div>{{ weaponSelect === '全部' ?item.OfficialStatsTotal.DamagePlayer :item.data.OfficialStatsTotal.DamagePlayer}}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>
.weapon_list_item_bottom_left_right {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.weapon_list_item_bottom_left_left {
  display: flex;
  flex-direction: column;
}


.weapon_list_item_bottom_left {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.weapon_list_item_bottom {
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  width: 80%;
  gap: 10px;
}

.weapon_list_item_center {
  margin: 5px 0 10px 0;
  border-radius: 20px;
  text-align: center;
  width: 80%;
  background-color: #90939999;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
}

.weapon_list_item_img img {
  width: 70px;
  margin-left: 10px;
}

.weapon_list_item_img {
  display: flex;
  align-items: center;
  justify-content: center;
}

.weapon_list_item_grade_left {
  text-align: left;
}

.weapon_list_item_grade_right {
  text-align: right;
}

.weapon_list_item_grade {
  display: flex;
  flex-direction: row;
  width: 50%;
  justify-content: space-between;
}

.weapon_list_item_top {
  display: flex;
  justify-content: center;
  font-size: 15px;
  width: 90%;
}

.weapon_list_item_div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.weapon_list_div {
  padding: 10px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.weapon_list_item {
  width: 100%;
  background-color: #90939944;
  border-radius: 5px;
}

.weapon_list {
  flex: 1 1 0%;
  width: 100%;
  background-color: rgb(248 248 248);
  border-radius: 5px;
  max-height: 600px;
  overflow-y: auto;
  height: 600px;
}

.weapon_select_check {
  color: white;
  background: rgb(64, 158, 255);
  border-radius: 5px;
}

.weapon_select_item {
  text-align: center;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}

.weapon_select {
  width: 100%;
  background-color: rgb(248 248 248);
  border-radius: 5px;
}

.weapon {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-top: 20px;
}

@media screen and (max-width: 767px) {
  .weapon_list_div {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .weapon_list_item_center {
    width: 100%;
  }

  .weapon_list_item_bottom {
    width: 100%;
    font-size: 10px;
    gap: 3px;
  }

  .weapon_list_item_top {
    font-size: 13px;
  }

  .weapon_list_item_img img {
    width: 60px;
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  .weapon_list_div {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .weapon_list_item_center {
    width: 90%;
  }
}

@media screen and (min-width: 993px) and (max-width: 1200px) {
  .weapon_list_item_center {
    width: 90%;
  }

  .weapon_list_item_bottom {
    width: 90%;

  }
}

@media screen and (min-width: 1200px) and (max-width: 1600px) {
  .weapon_list_item_center {
    width: 90%;
  }

  .weapon_list_item_bottom {
    width: 100%;
    font-size: 11px;
  }
}
</style>
