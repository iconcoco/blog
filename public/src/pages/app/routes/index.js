import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'

Vue.use(VueRouter)


const RM = new VueRouter({ routes, mode: 'history' })

RM.beforeEach((to, from, next)=>{
  // if (!to.name) {
  //   return next({ path: '/blog/index' })
  // }
  next()
})


// RM.afterEach((to) => { 
  
// });

export default RM
