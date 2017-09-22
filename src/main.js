// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import router from './router'
import Components from './components'
import App from './views/app/myApp';

import './sass/app.scss';

import './js/bip-common-js.js'
import utils from './js/bip-utils-js'
import bipDateUtil from './js/bip-date-js'
Vue.use(utils)
Vue.use(bipDateUtil)
Vue.config.productionTip = false
Vue.use(Components)
// Vue.use(myAppToolbar)
// Vue.use(App)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
 