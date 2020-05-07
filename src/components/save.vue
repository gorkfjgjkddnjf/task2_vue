<template>
  <div class="save row justify-content-center">
    <div class="col-12">
      <h1 v-if="savedData.length == 0" class=" text-center">Тут пока что пусто</h1>
      <div v-else class="saved-data">
        <h1 class=" text-center">Вы ввели:</h1>
        <div class="row justify-content-center">
          <!-- <div class="col-6">
            <p v-for="label in labelData" :key="label.id">{{label}}</p>
          </div> -->

          <div class="col-6">
         
            <p v-for="data in filteredData" :key="data.id">{{data.label}} -- {{data.value}}</p>
          </div>
        </div>

        <div class="col-12 image">
          
        </div>      
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
      },
      labelData: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    methods:{
      showImage(){
        this.savedData.forEach((data, i) =>{

          if(data.name){
            let img = document.createElement('img')
            let block = document.querySelector('.image')

            new Promise((resolve) => {
              img.alt = 'your Photo'
              img.id = 'test' + i
              img.className = 'mb-3 img-fluid'
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
      console.log(this.labelData)
      this.showImage()
    }
}
</script>

<style lang="sass">
.save
  font-size: 24px
</style>