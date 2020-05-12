
<template>
  <div class="save row justify-content-center">
      <router-link :to="{name:'main', params: {inputData: filteredData}}">
        <button class="btn btn-primary w-100 my-2" id="save">Back to Form</button>
      </router-link>
    <div class="col-12">
      <h1 v-if="savedData.length == 0 && checkData.length == 0" class=" text-center">Тут пока что пусто</h1>
      <div v-else class="saved-data">
        <h1 v-if="text" class=" text-center">Вы ввели:</h1>
        <div class="row justify-content-center">
          <div class="col-12">        
            <div v-for="data in filteredData" :key="data.id">

              <p class="p" v-if="data.label">{{data.label}}</p>
              <p class="p" v-else>Похоже здесь не было заголовка</p>
              <p class="p">{{data.value}}</p>


            </div>
          </div>
        </div>

        <div v-show="image" class="col-12 image">
          <h1>Картинки, которые вы загрузили:</h1>
        </div> 

        <div v-if="checkData.length != 0" class="col-12 check">
          <h1>Технологии, которые вы выбрали:</h1>
          <button class="btn btn-primary mx-2" v-for="check in checkData" :key="check.id">{{check.value}}</button>
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
        filteredData: [],
        image: false,
        text: false
      }
    },
    props: {
      savedData:{
        type: Array,
        default(){
          return []
        } 
      },
      checkData: {
        type: Array,
        default(){
          return []
        } 
      }
      // labelData: {
      //   type: Object,
      //   default(){
      //     return {}
      //   }
      // }
    },
    methods:{
      showImage(){
        this.savedData.forEach((data, i) =>{

          if(data.name){
            this.image = true
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
            this.image = false
            this.text = true
          }
        })
      }
    },
    mounted(){
      this.showImage()
    }
}
</script>

<style lang="sass">
.save
  font-size: 24px

.p
  border-bottom: 1px solid rgba(0, 0, 0, .4)

</style>