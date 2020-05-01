import Vue from 'vue'
import App from './App.vue'
import store from './store'
import 'jquery'
import 'popper.js'
import 'bootstrap'
import './assets/sass/main.sass'



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
