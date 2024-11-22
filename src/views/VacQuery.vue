<script setup>
  import NavVue from "@/components/Nav.vue"
  import SearchVue from "@/components/Search.vue"
  import FooterVue from "@/components/Footer.vue"
</script>

<template>
  <NavVue></NavVue>
  <SearchVue :is-pubg-search="false" :isVacSearch="true"></SearchVue>
  <router-view></router-view>
  <!--<FooterVue></FooterVue>-->
</template>

<style scoped>

</style>
