import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import './styles.scss'
import './assets/css/global.css'
import { Form, FormItem, Input } from 'element-ui'
// Vue.use(Form, FormItem, Input)
Vue.use(ElementUI)

import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
