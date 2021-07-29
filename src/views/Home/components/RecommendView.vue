<template>
  <div class="flex-row-spaceAround recommend">
    <div class="recommend-item" v-for="item in recommend" :key="item.sort">
      <a :href="item.link">
        <img :src="item.image" />
        <p>{{item.title}}</p>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name:"RecommendView",
    props:{
      recommend:{
        type:Array,
        default(){
          return []
        }
      }
    }
  }
</script>

<style scoped>
.recommend{
  border-bottom: 5px solid #eee;
  text-align: center;
}
.recommend-item img{
  width: 4rem;
  height: 4rem;
  margin-bottom: 10px;
}

.recommend-item{
  padding: 15px 0 20px;
}
</style>