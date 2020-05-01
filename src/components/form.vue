<template>
    <div class="form1">

    </div>
</template>

<script>
//import { mapActions} from 'vuex'
export default {
    name: 'form1',
        data() {
      return {
        requestURL: './json/signin.json'
      }
    },
    methods:{
    //   ...mapActions([
    //     'GET_JSON'
    //   ])
    buildForm(requestURL) {
  fetch(requestURL)
    .then((response) => response.json())
    .then((jsonObj) => {

      let mainContainer = document.querySelector('.form1');
      let form = document.createElement('form');

      form.setAttribute('role', 'form');
      form.setAttribute('name', jsonObj.name);

    //   buildFields(jsonObj, form);
    //   buildRef(jsonObj,form);
    //   buildButtons(jsonObj, form);
    //   buildLink(form);
      mainContainer.append(form);
      
      //buildMask(jsonObj);

    });
}
    },
    mounted(){
      //this.GET_JSON()
      this.buildForm(this.requestURL)
    }
}
</script>

<style>

</style>