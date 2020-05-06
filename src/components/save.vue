<template>
  <div class="save row justify-content-center">
    <div class="col-12">
      <h1 v-if="savedData.length == 0" class=" text-center">Тут пока что пусто</h1>
      <div v-else class="saved-data">
        <h1 class=" text-center">Вы ввели:</h1>
        <ul>
          <li v-for="data in savedData" :key="data.id">{{data}}</li>
        </ul>       
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'save',
    data(){
      return{

      }
    },
    props: {
      savedData:{
        type: Array,
        default(){
          return []
        } 
      }
    },
    mounted(){
      console.log(this.savedData)
    }
}
</script>

<style lang="sass">
.save
  font-size: 24px
</style>