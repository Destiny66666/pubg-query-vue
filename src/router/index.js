import { createRouter, createWebHistory } from 'vue-router'

// 引入组件
import HomeVue from '@/views/Home.vue'
import PlayerQueryVue from '@/views/PlayerQuery.vue'
import RecordQueryVue from '@/components/RecordQuery.vue'
import TeamListVue from '@/components/TeamList.vue'
import WeaponListVue from '@/components/WeaponList.vue'
import LifeTimeVue from '@/components/LifeTime.vue'
import LeaderBoardVue from '@/views/LeaderBoard.vue'
import PubgOnlineVue from '@/views/PubgOnline.vue'
import VacQueryVue from "@/views/VacQuery.vue"
import SteamInfoVue from "@/components/SteamInfo.vue"
import NewsVue from "@/views/News.vue"
import ArticleVue from "@/views/Article.vue"

const routes = [
    { path: '/', component: HomeVue },
    {
        path: '/query',
        component: PlayerQueryVue,
        children: [
            {
                path: 'player-query',
                component: RecordQueryVue
            },
            {
                path: 'team-list',
                component: TeamListVue
            },
            {
                path: 'weapon-list',
                component: WeaponListVue
            },
            {
                path: 'life-time',
                component: LifeTimeVue
            },
        ],
    },
    {path: '/leader-board', component: LeaderBoardVue},
    {path: '/pubg-online', component: PubgOnlineVue},
    {
        path: '/vac-query',
        component: VacQueryVue,
        children: [
            {
                path: 'steam-info',
                component: SteamInfoVue
            }
        ]
    },
    {path: '/news', component: NewsVue},
    {
        path: '/article/:id',
        component: ArticleVue
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
