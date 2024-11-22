import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import ECharts from 'vue-echarts';
import 'echarts';


const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate);
app.component('ECharts',ECharts)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
