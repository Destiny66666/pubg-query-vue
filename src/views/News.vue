<script setup>
import NavVue from "@/components/Nav.vue"
import SearchVue from "@/components/Search.vue"
import FooterVue from "@/components/Footer.vue"
import {Icon} from "@iconify/vue";
import {getTouristArticleListData, getCategoryListData} from "@/api/articleApis.js"
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const category_id = ref()
const categoryList = ref()
const articleList = ref()
const cateGoryTitle = ref('')

onMounted(async () => {
  await getCategoryList()
  await getTouristArticleList()
})

const getCategoryList = async () => {
  const result = await getCategoryListData()
  categoryList.value = result.data
  category_id.value = result.data[0].id
  cateGoryTitle.value = result.data[0].name
}

const getTouristArticleList = async () =>{
  const result = await getTouristArticleListData({
    "category_id": category_id.value,
  })
  articleList.value = result.data.data
}

const switchCategory = (data)=>{
  category_id.value = data
  getTouristArticleList()
}

const articleBtn = (id)=>{
  router.push('/article/'+id)
}

</script>

<template>
  <NavVue></NavVue>
  <SearchVue :isPubgSearch="false" :isVacSearch="false"></SearchVue>
  <div class="abc">
    <el-row class="container">
      <el-col :span="24" class="top">
        <Icon icon="line-md:menu" width="30" height="30" style="color: #0099ff"/>
        <span>资讯列表-{{cateGoryTitle}}</span>
      </el-col>
      <el-col :span="24" class="adv">
        <img src="../assets/3e27c90507ad213ee388bd5524b0ad450f61a5d6.png" alt="">
      </el-col>
      <el-col :span="24">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4">
            <el-row class="category">
              <el-col :xs="12" :sm="12" :md="12" :lg="24" :xl="24" class="category_item" @click="switchCategory(item.id)"
                      v-for="(item, index) in categoryList" :key="item.id" :class="{category_item_check:category_id===item.id}">
                {{item.name}}
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="1" :xl="1" style="display: flex;justify-content: center;">
            <div class="separator"></div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="19" :xl="19">
            <el-row class="news">
              <el-col :span="24" class="new_item" v-for="(item, index) in articleList" :key="item.id" @click="articleBtn(item.id)">
                <el-row type="flex" justify="space-between">
                  <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" class="news_item_left">
                    <div class="news_item_left_top">
                      <span class="news_item_title">{{item.title}}</span>
                      <span class="news_item_introduction">{{item.introduction}}</span>
                    </div>
                    <el-button class="btn" type="primary" plain style="width: 200px;" @click="articleBtn(item.id)">点击阅读</el-button>
                  </el-col>
                  <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="news_item_right">
                    <img class="news_item_img" :src="item.image" alt="">
                    <span>{{item.create_time}}</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <FooterVue></FooterVue>
</template>

<style scoped>
.new_item {
  cursor: pointer;
  background-color: rgb(255 255 255);
  padding: 10px;
  border-radius: 10px;
  --tw-shadow: 0 1px 3px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.news_item_left_top {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.news_item_introduction {
  color: rgb(102 102 102);
  font-weight: 700;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制显示的行数为2 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* 当文本溢出时显示省略号 */
  white-space: normal; /* 允许文本正常换行 */
  line-height: 1.5; /* 设置行高，确保行数计算准确 */
  max-height: calc(1.5em * 2); /* 行高乘以行数，确保盒子高度正确（可选，但有助于避免布局问题） */
  width: 95%;
}

.news_item_title {
  font-weight: 600;
  font-size: 28px;
  color: #434040;
}

.news_item_left {
  display: flex;
  flex-direction: column;
  width: 90%;
  justify-content: space-between;
}

.news_item_img {
  width: 100%;
  height: 210px;
  object-fit: cover;
  max-width: 190px;
  border-radius: 5px;
}

.news_item_right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.news {
  max-height: 100vh;
  width: 100%;
  overflow: auto;
  display: flex;
  gap: 20px;

}

.separator {
  width: 2%;
  height: 100%;
  background-color: rgb(128 128 128);
  opacity: 0.2;
}

.category_item_check {
  color: white;
  background-color: #0099ff !important;
}

.category_item {
  height: 40px;
  background-color: rgb(239 239 239);
  line-height: 40px;
  border-radius: 5px;
  padding-left: 5px;
  cursor: pointer;
}

.category {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.adv img {
  width: 100%;
  border-radius: 10px;
  margin: 10px 0;
}

.top {
  margin-top: -50px;
  height: 50px;
  background-color: #f8f8f8dd;
  --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.container {
  width: 70%;
  margin: 0 auto;
}

.abc {
  background-color: #faf7f7;
  padding-bottom: 40px;
}
@media screen and (max-width: 768px){
  .category{
    flex-direction: row;
    gap: 0;
    margin-bottom: 10px;
  }
  .btn{
    display: none;
  }
  .container {
    width: 90%;
  }
  .news_item_img{
    max-width: 100%;
  }
  .news_item_right{
    margin-top: 10px;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .category{
    flex-direction: row;
    gap: 0;
    margin-bottom: 10px;
  }
  .container {
    width: 90%;
  }
  .news_item_img{
    max-width: 100%;
  }
  .news_item_right{
    margin-top: 10px;
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .category{
    flex-direction: row;
    gap: 0;
    margin-bottom: 10px;
  }
  .container {
    width: 90%;
  }
}
</style>
