<template>
<div  class="main-form container">
  <div class="row justify-content-center align-items-center h-100">
    <div class="col-12 col-xl-2 err">
      <p v-for="error in er" :key="error.id">{{error}}</p>
    </div>
    <div class="col-12 col-sm-8 col-lg-8 col-xl-6" id="main-container"></div>

    <div class="col-12 col-sm-4 col-lg-3 col-xl-2" id="link-json">
      <a href="#" class="btn btn-primary w-100 my-2" id="link0">signin.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link1">signup.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link2">colorsheme.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link3">addpost.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link4">interview.json</a>
      <router-link :to="{name:'save', params: {savedData: inputData, checkData: checkData, url: requestURL}}">
        <button class="btn btn-primary w-100 my-2" id="save" @click="getInputData">save</button>
      </router-link>
    </div>
    <!-- <input type="text" v-model="test"> -->
  </div>

</div>
    
</template>

<script>
import validation from './mixins/validation'
import Inputmask from 'inputmask'
  export default {
    mixins:[validation],
    name: 'App',
    data() {
      return {
        requestURL: './json/signin.json',
        inputData: [],
        checkData: [],
        test: null,
        dis: true,
        img: null,
      }
    },
    props:{
      returnedData:{
        type: Array,
        default(){
          return []
        }
      },
      oldUrl:{
        type: String,
        default(){
          return ''
        }
      }
    },
    components: {},
    computed:{
      er(){
        return this.errors
      }
    },
    methods: {
      getLabel(id){
        let label = document.querySelectorAll('label')

        if(label.length != 0){
          label.forEach((element) => {
          if(id == element.htmlFor && /^option/.test(element.htmlFor)){
            this.checkData.push({value: element.textContent})
          }
          if(id == element.htmlFor){
            this.labelData = new Object({label: element.textContent})
          }
        });
        return true
        }
        else{
          return false
        }
      },
      getInputData(){
        let input = document.querySelectorAll('input')
        let textarea = document.querySelector('textarea')

        if(textarea != null && textarea.value != ''){
          if(this.getLabel(textarea.id)){
            this.inputData.push(Object.assign(this.labelData,{value: textarea.value, id: textarea.id})) 
          }
          else{
            this.inputData.push({value: textarea.value, id: textarea.id})
          }
        }
        input.forEach(element => {
          if(element.type == 'file' && element.files[0] != undefined){
            this.inputData.push(element.files[0])
          }
          if(element.value != "on" && element.type != 'file' && element.type != 'checkbox'){
            if(this.getLabel(element.id)){
              this.inputData.push(Object.assign(this.labelData,{value: element.value, id: element.id})) 
            }
            else{
              this.inputData.push({value: element.value, id: element.id})
            }
          }
          if(element.checked){
            this.getLabel(element.id)
          }
        });
      },
      buildWrapper(fields) {

        let formGroup = document.createElement('div');

        formGroup.className = 'form-group';
        if (fields.input.type == 'file') {
          formGroup.className = 'custom-file my-2';
        }
        if (fields.input.type == 'technology') {
          formGroup.className = 'btn-group-toggle';
          formGroup.setAttribute('data-toggle', 'buttons')
        }
        if (fields.input.type == 'checkbox') {
          formGroup.className = 'form-check';
        }
        return formGroup;

      },
      
      buildForm(requestURL) {
        import(`${requestURL}`)
        .then(data =>{
          let mainContainer = document.querySelector('#main-container');
          let form = document.createElement('form');

          form.setAttribute('role', 'form');
          form.setAttribute('name', data.name);
          this.buildFields(data, form);
          this.buildRef(data, form);
          this.buildButtons(data, form);
          this.buildLink(form)

          mainContainer.append(form);
          console.log(this.returnedData)
          this.returnData(this.returnedData)
          this.buildMask(data);
          this.renderPreview()
          this.checkFill()
      })
      .catch(err => {
        alert('WTF')
        console.log(err)
      })
        
      },
      buildFields(jsonObj, form) {
        let vm = this
        jsonObj.fields.forEach(function (fields, i) {
          let wrapper = vm.buildWrapper(fields);
          if (fields.input.type == 'technology') {

            wrapper.append(vm.buildLabel(fields, i));

            fields.input.technologies.forEach((techelem, i) => wrapper.append(vm.buildTechnology(techelem, i)));

          } else if (fields.input.type == 'checkbox') {
            wrapper.append(vm.buildInput(fields, i), vm.buildLabel(fields, i));
          } else {
            wrapper.append(vm.buildLabel(fields, i), vm.buildInput(fields, i));
          }

          form.append(wrapper);
        });
      },
      buildInput(fields, i) {
        let input = document.createElement('input');

        input.type = fields.input.type;
        input.id = 'test' + i;
        if (fields.input.type == 'file') {
          let block = document.createElement('div')
          let preview = document.createElement('div')

          preview.classList.add('preview', 'hide-preview', 'form-group')
          input.className = 'custom-file-input';

          preview.append(this.buildImagePreview(i), this.buildDeleteBtn())
          block.append(input, preview)

          input.addEventListener("change", this.renderPreview)
          return block
        }
        if (fields.input.type != 'checkbox') {
          input.className = 'form-control form-control-lg';
        } else {
          input.className = 'form-check-input check';
          if (fields.input.checked == 'false') {
            input.checked = false;
          } else {
            input.checked = true;
          }
          input.id = 'check' + i;
          input.addEventListener("click", this.backToDefaultColor);
        }

        if (fields.input.required != undefined) {
          input.required = fields.input.required;
        }
        if (fields.input.placeholder != undefined) {
          input.placeholder = fields.input.placeholder;
        }
        if (fields.input.type == 'color') {
          this.buildDatalist(fields, i, input);
          input.addEventListener("input", this.changeColor);
        }

        if (fields.input.type == 'textarea') {

          input.remove();

          let textarea = document.createElement('textarea');

          textarea.required = fields.input.required;
          textarea.className = input.className;
          textarea.id = 'test' + i;

          return textarea;
        }

        this.buildInputFile(fields, input);
        return input;
      },
      buildLabel(fields, i) {
        if (fields.label != undefined) {
          let label = document.createElement('label');
          label.htmlFor = 'test' + i;
          label.textContent = fields.label;
          if (fields.input.type == 'checkbox') {
            label.className = 'form-check-label';
          }
          if (fields.input.type == 'file') {
            label.className = 'custom-file-label';
          }
          if (fields.input.type == 'technology') {
            let col = document.createElement('div');
            col.className = 'col pl-0';
            col.append(label);
            return col;
          }
          return label;
        } else {
          return '';
        }
      },
      buildButtons(jsonObj, form) {
        if (jsonObj.buttons != undefined) {

          let row = document.createElement('div');
          row.className = 'row justify-content-center mt-4';

          jsonObj.buttons.forEach(function (buttons) {

            let col = document.createElement('div');
            let btn = document.createElement('button');

            col.className = 'col-6 col-sm-6 col-md-6';
            btn.className = 'btn btn-primary w-100 mb-5';

            btn.type = 'submit';
            btn.textContent = buttons.text;                       

            col.append(btn);
            row.append(col);

          });

          form.append(row)

        }
      },
      buildRef(jsonObj, form) {
        let vm = this
        if (jsonObj.references != undefined) {
          let row = document.createElement('div');
          row.className = 'row justify-content-between';

          jsonObj.references.forEach(function (references, i) {

            let p = document.createElement('p');
            let a = document.createElement('a');

            a.textContent = references.text;
            a.name = references.ref;
            a.href = '#';


            if (references['text without ref'] != undefined)
              p.textContent = references['text without ref'] + ' ';

            if (form.name == 'register')
              row.className = ' text-center';

            a.addEventListener('click', {
              handleEvent() {
                form.remove();
                vm.requestURL = './json/' + a.name + '.json';
                vm.buildForm(vm.requestURL);
              }
            });


            if (references.input != undefined) {
              p.remove();
              let wrapper = vm.buildWrapper(references);
              wrapper.append(vm.buildInput(references, i));
              row.className = 'pl-4';
              form.append(wrapper);
            } else if (form.name == 'login') {
              let col = document.createElement('div');
              col.className = 'col-12 col-sm-5';
              p.className = 'ref' + i;
              p.append(a);
              col.append(p);
              row.append(col);
            } else {
              p.append(a);
              row.append(p);
            }
          });
          form.append(row);

        }
      },
      buildDatalist(fields, i, colorfield) {

        let datalist = document.createElement('datalist');

        colorfield.setAttribute('list', 'colorlist' + i);
        colorfield.removeAttribute('placeholder');
        datalist.id = 'colorlist' + i;

        for (let key of fields.input.colors) {
          let option = document.createElement('option');
          option.value = key;
          datalist.append(option);
        }

        colorfield.append(datalist);
        return colorfield;

      },
      changeColor(event) {

        let body = document.querySelector('body');
        let checkbox = document.querySelector('.check');
        body.style.color = event.target.value;
        checkbox.checked = false;

      },
      backToDefaultColor() {

        let checkbox = document.querySelector('.check');
        let body = document.querySelector('body');
        //let computedStyle = getComputedStyle(document.body);
        if (checkbox.checked) {
          body.style.color = 'rgb(33, 37, 41)';
          //body.style.color = computedStyle.color;
        }

      },
      buildInputFile(fields, input) {

        if (fields.input.type == 'file' && fields.input.filetype != undefined) {

          input.setAttribute('multiple', fields.input.multiple)
          input.className = 'form-control-file';

          let arr = '';

          fields.input.filetype.forEach(elem => {

            arr += '.' + elem + ', ';
            input.setAttribute('accept', arr);

          });
        } else if (fields.input.type == 'file') {
          input.className = 'form-control-file';
        }
        return input;
      },
      buildTechnology(techelem, i) {

        let technologies = document.createElement('input');
        let label = document.createElement('label');

        technologies.type = 'checkbox';
        technologies.id = 'option' + i;
        technologies.setAttribute('autocomplete', 'off');

        label.htmlFor = 'option' + i;
        label.textContent = techelem;
        label.className = 'btn btn-primary btn-tags';

        label.append(technologies);
        return label;
      },
      buildLink(form) {
        let vm = this
        let link0 = document.querySelector('#link0');
        let link1 = document.querySelector('#link1');
        let link2 = document.querySelector('#link2');
        let link3 = document.querySelector('#link3');
        let link4 = document.querySelector('#link4');
        link0.onclick = function () {
          vm.requestURL = './json/signin.json';
          form.remove();
          vm.errors = []
          vm.returnedData = []
          vm.buildForm(vm.requestURL);
        }
        link1.onclick = function () {
          vm.requestURL = './json/signup.json';
          form.remove();
          vm.errors = []
          vm.returnedData = []
          vm.buildForm(vm.requestURL);
        }
        link2.onclick = function () {
          vm.requestURL = './json/colorsheme.json';
          form.remove();
          vm.errors = []
          vm.returnedData = []
          vm.buildForm(vm.requestURL);
        }
        link3.onclick = function () {
          vm.requestURL = './json/addpost.json';
          form.remove();
          vm.errors = []
          vm.returnedData = []
          vm.buildForm(vm.requestURL);
        }
        link4.onclick = function () {
          vm.requestURL = './json/interview.json';
          form.remove();
          vm.errors = []
          vm.returnedData = []
          vm.buildForm(vm.requestURL);
        }
      },
      buildMask(jsonObj){

        jsonObj.fields.forEach(function(fields, i){
          if(fields.input.mask != undefined){
            let input = document.querySelector('#test' + i);
            let im = new Inputmask(fields.input.mask)
            input.type = 'text';
            im.mask(input)
          }
        })
      },
      returnData(data){
        if(data.length != 0){
          let input = document.querySelectorAll('input')
         // let label = document.querySelectorAll('label')
          for(let i = 0; i < input.length; i++){
            if(input[i].type != 'color' && input[i].type != 'checkbox'){
              console.log(input[i].id, ' - ', data[i].id)
              if(input[i].id == data[i].id){
                console.log(2)
                input[i].value = data[i].value
              }
            }
          }
        }
      },
      buildDeleteBtn(){
        let btn = document.createElement('button')
        btn.textContent = 'Удалить'
        btn.className = 'btn btn-primary delete-btn mt-3 mb-5'
        return btn
      },
      buildImagePreview(i){
        this.img = document.createElement('img')
        this.img.alt = 'preview-img'
        this.img.id = 'img' + i
        this.img.className = 'img-fluid'
        return this.img
      },
      renderPreview(){
        let btn = document.querySelectorAll('.delete-btn')
        let img = document.querySelectorAll('img')
        let input = document.querySelectorAll('.custom-file-input')
        let label = document.querySelectorAll('.custom-file-label')
        let preview = document.querySelectorAll('.preview')

        input.forEach((element,i) =>{
          if(element.files[0] != undefined){
            let reader  = new FileReader();

            reader.onloadend = function () {
              img[i].src = reader.result;
            }
            reader.readAsDataURL(element.files[0]);

            preview[i].classList.remove("hide-preview")
            preview[i].classList.add('show-preview')
            label[i].classList.add('hide-preview')
            element.classList.add('hide-preview')
            label[i].classList.remove('show-preview')
            element.classList.remove('show-preview')

            btn[i].onclick = function () {
              element.value = null
              preview[i].classList.remove("show-preview")
              preview[i].classList.add('hide-preview')
              label[i].classList.add('show-preview')
              element.classList.add('show-preview')
            }
          }
          else{
            preview[i].classList.remove("show-preview")
            preview[i].classList.add('hide-preview')
            label[i].classList.add('show-preview')
            element.classList.add('show-preview')           
          }
        })
      },
    },
    mounted() {
      if(this.oldUrl != ''){
        this.buildForm(this.oldUrl)
      }else{
        this.buildForm(this.requestURL)
      }    
    }
  }
</script>

<style lang="sass">
.hide-preview
  display: none

.show-preview
  display: block
</style>