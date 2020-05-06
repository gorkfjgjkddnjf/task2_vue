<template>
  <div class="save row justify-content-center">
    <div class="col-12">
      <h1 v-if="savedData.length == 0" class=" text-center">Тут пока что пусто</h1>
      <div v-else class="saved-data">
        <h1 class=" text-center">Вы ввели:</h1>
        <ul class="ul">
          <li v-for="data in filteredData" :key="data.id">{{data}}</li>
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
        filteredData: []
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
    methods:{
      showImage(){
        this.savedData.forEach((data, i) =>{

          if(data.name){
            let img = document.createElement('img')
            let block = document.querySelector('.saved-data')

            new Promise((resolve) => {
              img.alt = 'your Photo'
              img.id = 'test' + i
              img.className = 'mb-3'
              block.append(img) 
              resolve()          
            })
            .then(() =>{
              let preview = document.querySelectorAll('img');
              preview.forEach((previewItem) => {
                let reader  = new FileReader();
                reader.onloadend = function () {
                  if(previewItem.id == img.id){
                    previewItem.src = reader.result;
                  }               
                }
                reader.readAsDataURL(data);
              })
            }) 
          }
          else{
            this.filteredData.push(data)
          }
        })
      }
    },
    mounted(){
      console.log(this.savedData)
      this.showImage()
    }
}
</script>

<style lang="sass">
.save
  font-size: 24px

img
  width: 350px
  height: 150px
</style>