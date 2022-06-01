import Vue from 'vue'
import App from './App.vue'
import { BootstrapVueIcons, BootstrapVue } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/styles.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

Vue.use(BootstrapVueIcons)
Vue.use(BootstrapVue)
