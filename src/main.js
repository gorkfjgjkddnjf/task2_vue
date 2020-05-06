import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'jquery'
import 'popper.js'
import 'bootstrap'
import './assets/sass/main.sass'



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
