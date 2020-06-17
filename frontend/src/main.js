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
import VueI18n from 'vue-i18n';
import messages from './lang/index.js';

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(VueI18n);

const i18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
	messages
});

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

new Vue({
  el: '#app',
  router,
  i18n,
  render: h => h(App)
})
