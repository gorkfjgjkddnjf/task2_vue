<template>
<div  class="main-form container">
  <div class="row justify-content-center align-items-center h-100">
    <div class="col-12 col-sm-8 col-lg-8 col-xl-6" id="main-container"></div>

    <div class="col-12 col-sm-4 col-lg-3 col-xl-2" id="link-json">
      <a href="#" class="btn btn-primary w-100 my-2" id="link0">signin.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link1">signup.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link2">colorsheme.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link3">addpost.json</a>
      <a href="#" class="btn btn-primary w-100 my-2" id="link4">interview.json</a>

      <router-link :to="{name:'save', params: {savedData: inputData, labelData: labelData}}">
        <a href="#" class="btn btn-primary w-100 my-2" id="link4" @click="getInputData">save</a>
      </router-link>
    </div>
  </div>

</div>
    
</template>

<script>

import Inputmask from 'inputmask'
  export default {
    name: 'App',
    data() {
      return {
        requestURL: './json/signin.json',
        inputData: [],
        checkData:[],
        labelData: {}
      }
    },
    components: {},

    methods: {
      getLabel(id){
        let label = document.querySelectorAll('label')
        label.forEach(element => {
          if(id == element.htmlFor && /^option/.test(element.htmlFor)){
            this.inputData.push(element.textContent)
          }
          if(id == element.htmlFor){
            this.labelData = element.textContent
            //Object.assign(this.labelData, {label: element.textContent})
          }
        });
      },
      getInputData(){
        let input = document.querySelectorAll('input')
        let textarea = document.querySelector('textarea')

        if(textarea != null && textarea.value != ''){
          this.inputData.push(textarea.value)
        }
        input.forEach(element => {
          if(element.type == 'file' && element.files[0] != undefined){
            this.inputData.push(element.files[0])
          }
          if(element.value != "" && element.value != "on" && element.type != 'file' && element.type != 'checkbox'){
            this.getLabel(element.id)
            this.inputData.push(Object.assign(this.labelData, {value: element.value})) 
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

          this.buildMask(data);
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
          input.className = 'custom-file-input';
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
          vm.buildForm(vm.requestURL);
        }
        link1.onclick = function () {
          vm.requestURL = './json/signup.json';
          form.remove();
          vm.buildForm(vm.requestURL);

        }
        link2.onclick = function () {
          vm.requestURL = './json/colorsheme.json';
          form.remove();
          vm.buildForm(vm.requestURL);
        }
        link3.onclick = function () {
          vm.requestURL = './json/addpost.json';
          form.remove();
          vm.buildForm(vm.requestURL);
        }
        link4.onclick = function () {
          vm.requestURL = './json/interview.json';
          form.remove();
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
      }
    },

    mounted() {
      //this.GET_JSON()
      this.buildForm(this.requestURL)
    }
  }
</script>

<style>

</style>