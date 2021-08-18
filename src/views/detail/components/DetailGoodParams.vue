<template>
  <div v-if="Object.keys(goodparams).length !== 0" class="goodParams">
    <div>
      <p class="title">{{goodparams.info.key}}</p>
      <table class="table">
        <tr class="row" v-for="(item,index) in goodparams.info.set" :key="index">
          <td class="key">{{item.key}}</td>
          <td class="value">{{item.value}}</td>
        </tr>
      </table>
    </div>
    <div style="margin-top:20px">
       <p class="title">{{goodparams.rule.key}}</p>
       <p style="margin: 10px 0">{{goodparams.rule.desc}}</p>
       <table v-for="(table,index) in goodparams.rule.tables" :key="index" class="table">
        <tr class="row" v-for="(item,index1) in table" :key="index1">
          <td v-for="(item1,index2) in item" :key="index2">{{item1}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name:"DetailGoodParams",
    props:{
      goodparams:{
        type:Object,
        default(){
          return {}
        }
      }
    }
  }
</script>

<style scoped>
  .goodParams{
    padding: 20px 10px;
    font-size: 15px;
  }
  .title{
    font-weight: 700;
    font-size: 18px;
  }
  .table{
    width: calc(100vw - 20px);
    margin-bottom: 20px;
  }
  .row{
    line-height: 40px;
    border-bottom: solid 1px #666;
  }
  .key{
    width: 30vw;
    padding-left: 5px;
  }
  .value{
    color: var(--color-high-text);
  }
</style>