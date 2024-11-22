<script setup>
import {ref, watch, onMounted, onBeforeUnmount, computed} from 'vue'
import {Menu,} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const isMobile = ref(window.innerWidth < 768);
const menuVisible = ref(false);
const activeMenu = computed(() => route.path);
let mode = 'horizontal'

// 切换菜单显示状态
const toggleMenu = () => {
  menuVisible.value = !menuVisible.value;
};
// 监听窗口尺寸变化
const handleResize = () => {
  getModeStart()
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    menuVisible.value = false; // 在桌面模式下隐藏菜单按钮
  }
};
const getModeStart = () => {
  if (window.innerWidth < 768) {
    mode = 'vertical'
  } else {
    mode = 'horizontal'
  }
}
onMounted(() => {
  getModeStart()
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
watch(route, (newRoute) => {
  activeMenu.value = newRoute.path;
});
</script>
<template>
  <div class="nav">
    <div class="nav_margin">
      <span>ZZP</span>
      <el-button
        style="float: right"
        v-show="isMobile"
        @click="toggleMenu"
        :icon="Menu">
      </el-button>
      <el-collapse-transition>
        <el-menu
          class="el-menu-demo menu "
          style="transition: all 0.2s linear 0s;"
          mode="horizontal"
          :ellipsis="false"
          v-show="!isMobile"
          :router="true"
          :default-active="activeMenu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/vac-query">VAC封禁查询</el-menu-item>
          <el-menu-item index="/pubg-online">PUBG在线统计</el-menu-item>
          <el-menu-item index="/leader-board">排行榜</el-menu-item>
        </el-menu>
      </el-collapse-transition>
    </div>
    <el-collapse-transition>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo menu "
        style="transition: all 0.2s linear 0s;"
        mode="vertical"
        :ellipsis="false"
        v-show="menuVisible"
        router
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/vac-query">VAC封禁查询</el-menu-item>
        <el-menu-item index="/pubg-online">PUBG在线统计</el-menu-item>
        <el-menu-item index="/leader-board">排行榜</el-menu-item>
      </el-menu>
    </el-collapse-transition>
  </div>
</template>

<style scoped>

.menu {
  width: 100%;
  z-index: 999 !important;
  top:-5px;
}
.nav {
  z-index: 999 !important;
  background-color: rgb(186, 123, 36);
  color: white;
  height: 56px;
}
.nav_margin{
  display: flex;
  line-height: 56px;
  width: 80%;
  margin: 0 auto;
}
.nav_margin>span{
  margin-right: 30px;
  font-size: 22px;
}
.el-button{
  background: none !important;
  border: none !important;
  color: white !important;
  font-size: 24px;
  margin-top: 5px;
}
.el-menu{
  margin: 0;
  padding:0;
  background-color: rgb(186, 123, 36) !important;
  color: white !important;
}
.el-menu--horizontal>.el-menu-item {
  align-items: center;
  border-bottom: 2px solid transparent;
  color: var(--el-menu-bg-color);
  display: inline-flex;
  height: 100%;
  justify-content: center;
  margin: 0;
}
.el-menu--horizontal.el-menu {
   border-bottom: none;
}
.el-menu--horizontal>.el-menu-item.is-active {
  margin-top: 1px;
  border-bottom: 2px solid var(--el-menu-bg-color);
  color: var(--el-menu-bg-color) !important;
}
.el-menu-item:hover {
  background-color: rgb(186, 123, 36) !important; /* 修改为你想要的颜色 */
  color: white !important; /* 修改为你想要的文本颜色 */
}
/* 当鼠标单击后，移开鼠标的样式 */
.el-menu--vertical .el-menu-item.menu-opened {
  background-color: rgb(186, 123, 36) !important; /* 修改为你想要的颜色 */
  color: white !important; /* 修改为你想要的文本颜色 */
}

.el-menu-item:not(:hover) {
  background-color: rgb(186, 123, 36) !important; /* 修改为你想要的颜色 */
  color: white !important; /* 修改为你想要的文本颜色 */
}
@media screen and (max-width: 768px) {
  .nav{
    height: 50px;
  }
  .nav_margin {
    display: block;
    line-height: 50px;
    width: 90%;

  }
  .nav_margin>span{
    font-size: 24px;
  }
}
</style>
