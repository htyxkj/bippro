import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/Test'
import CommLayUI from '@/views/common/commonLayUI'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Test
    },
    {
      path: '/layoutui',
      name: '页面布局',
      component: CommLayUI
    }
  ]
})
