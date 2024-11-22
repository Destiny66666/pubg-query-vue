<script setup>
  import NavVue from '@/components/Nav.vue'
  import FooterVue from '@/components/Footer.vue'
  import {getArticleData} from '@/api/articleApis.js'
  import {onMounted, ref} from "vue";
  import {useRoute} from "vue-router";

  const route = useRoute()
  const article = ref()

  onMounted(()=>{
    getArticle()
  })

  const getArticle = async ()=>{
    const result  = await getArticleData(route.params.id)
    article.value = result.data
  }
</script>

<template>
  <NavVue></NavVue>
  <div class="container">
    <div class="card">
      <h2 class="title">{{article?.title}}</h2>
      <span>{{article?.create_time}}</span>
      <el-divider />
      <img src="../assets/3e27c90507ad213ee388bd5524b0ad450f61a5d6.png" alt="" class="img">
      <div class="content" v-html="article?.content">
      </div>
    </div>
  </div>
  <FooterVue></FooterVue>
</template>

<style scoped>

.content{
  width: 90%;
}
.img{
  width: 90%;
  border-radius: 5px;
}
.title{
  font-weight: 800;
  font-size: 36px;
}
.card{
  width: 80%;
  margin: 0 auto;
  min-height: 500px;
  background-color: white;
  border-radius: 10px;
  --tw-shadow: 0 2px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 40px;
}
.container{
  background-color: #f3f1f1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  padding-bottom: 40px;
}
@media screen and (max-width: 768px){
  .card{
    padding: 5px;
    width: 95%;
  }
  :deep(.content p img) {
    width: 100%;
  }
}
@media screen and (min-width: 768px) and (max-width: 1200px) {
  :deep(.content p img) {
    width: 100%;
  }
}

</style>
