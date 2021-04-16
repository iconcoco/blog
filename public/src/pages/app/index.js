import Vue from 'vue'
import App from './App.vue'

import { Pagination, Form, FormItem, Input, Button, Message } from 'element-ui'

const ELEMENT_COM = [Pagination, Form, FormItem, Input, Button]

import router from '@app/routes/index.js'

import '../../../static/css/normaly.css'
import './sass/element-variables.scss'

ELEMENT_COM.forEach(com => {
  Vue.use(com)
})

Vue.prototype.$message = Message

// 开发辅助工具
Vue.config.devtools = process.env.NODE_ENV == 'development'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
