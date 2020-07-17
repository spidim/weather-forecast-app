import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import VueRouter from 'vue-router'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import Map from './components/Map.vue';
import Forecasts from './components/Forecasts.vue';
import MeteoMap from './components/MeteoMap.vue';
import About from './components/About.vue'
import Terms from './components/Terms.vue'
import i18n from './lang/i18n.js'
import store from './store'

Vue.use(BootstrapVue)
Vue.use(VueRouter)

const routes = [
  { path: '/forecast', component: Forecasts },
  { path: '/meteomap', component: MeteoMap },
  { path: '/', component: Map },
  { path: '/about', component: About },
  { path: '/terms', component: Terms }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

//console.log('app.$i18n._vm._uid', app.$i18n._vm._uid);