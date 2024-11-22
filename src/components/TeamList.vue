<script setup>
    import { useRoute, useRouter } from 'vue-router'
    import { onMounted, ref } from 'vue'
    import NProgress from 'nprogress'
    import 'nprogress/nprogress.css'
    import { getPubgSeasons, getPubgSeasonsData, getPubgSeasonsRankedData, getPubgMatchesData, getPubgUserPlayer } from "@/api/pubgApis.js";
    import { pubgUserMatches } from "@/stores/pubgUserMatches.js";
    import { pubgUserPlayer } from "@/stores/pubgUserPlayer.js";
    import {
        ArrowLeft,
    } from '@element-plus/icons-vue'
    const route = useRoute()
    const router = useRouter()
    const matchesData = ref()
    const pubgUserPlayerStore = pubgUserPlayer()
    const pubgUserMatchesStore = pubgUserMatches()

    onMounted(() => {
        getMatchesData()
    })

    const getMatchesData = async () => {
        NProgress.start()
        const result = await getPubgMatchesData({
            "platform": route.query.platform,
            "accountId": route.query.accountId,
            "page": 1,
            "matches": [{
                type: "match",
                id: route.query.matchesId
            }]
        }).then((result) => {
            matchesData.value = result.data[0]
            NProgress.done()
        }).catch((err) => {
            NProgress.done()
        });
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

    const search = async (data) => {
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
    const goBack = () => {
        router.back();
    };
</script>

<template>
    <el-button type="primary" :icon="ArrowLeft" @click="goBack()" style="margin-bottom: 10px;">返回{{route.query.searchName}}资料页</el-button>
    <el-row class="team_item" v-for="(item, index) in matchesData?.team_data">
        <el-col :span="24" class="team_item_th">
            <el-row>
                <el-col :xs="8" :sm="8" :md="9" :lg="9" :xl="9" class="matches_item_teamRank">
                    <span>{{item.rank}}</span>{{showTeamRank(item.rank)}}
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_th_right">
                    击杀
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_th_right">
                    爆头
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_th_right">
                    助攻
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_th_right">
                    伤害
                </el-col>
                <el-col :xs="4" :sm="4" :md="3" :lg="3" :xl="3" class="team_item_th_right">
                    存活时间
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="24" class="player">
            <el-row class="player_item" v-for="(value, key) in item.player">
                <el-col :xs="8" :sm="8" :md="9" :lg="9" :xl="9" @click="search(value.name)" class="ellipsis">
                    {{value.name}}
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_right">
                    {{value.kills}}
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_right">
                    {{value.headshotKills}}
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_right">
                    {{value.assists}}
                </el-col>
                <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3" class="team_item_right">
                    {{value.damageDealt}}
                </el-col>
                <el-col :xs="4" :sm="4" :md="3" :lg="3" :xl="3" class="team_item_right">
                    {{value.timeSurvived}}
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<style scoped>
    .ellipsis {
        cursor: pointer;

    }

    .ellipsis:hover {
        color: #0099ff;
    }

    .matches_item_teamRank span {
        font-weight: 800;
        font-size: 40px;
    }

    .matches_item_teamRank {
        font-style: italic;
        height: 100%;
        display: flex;
        align-items: center;

    }

    .team_item_th_right {
        line-height: 80px;
        text-align: right;
    }

    .team_item_right {
        text-align: right;

    }

    .player {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .player_item {
        background-color: #90939933;
        border-radius: 5px;
    }

    .team_item_th {
        height: 60px;
    }

    .team_item {
        padding: 0 10px 10px 10px;
        border-radius: 5px;
        background-color: #90939933;
        margin-bottom: 20px;
    }

    @media screen and (max-width: 768px) {
        .team_item_th_right {
            line-height: 60px;

        }

        .matches_item_teamRank span {
            font-size: 30px;
        }

        .team_item {
            font-size: 13px;
        }

        .team_item_th {
            height: 50px;
        }
    }

    @media screen and (min-width: 768px) and (max-width: 992px) {
        .team_item {
            font-size: 16px;
        }
    }
</style>
