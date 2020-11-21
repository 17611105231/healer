import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import './styles.scss'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(ElementUI)
Vue.component('tree-table', TreeTable)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
//通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 为请求头对象，添加token验证的Authorization
  config.headers.Authorization = sessionStorage.getItem('token')
  //在最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal * 1060)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
