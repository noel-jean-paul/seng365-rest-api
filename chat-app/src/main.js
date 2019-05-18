import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Venues from './Venues/Venues.vue';
import Venue from './Venues/SingleVenue/Venue.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import {VueMasonryPlugin} from 'vue-masonry';
Vue.use(VueMasonryPlugin);

import Vuetify from 'vuetify';
Vue.use(Vuetify);

Vue.prototype.$baseUrl = 'http://localhost:4941/api/v1';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/venues',
    name: 'venues',
    component: Venues
  },
  {
    path: '/venue/:venueId',
    name: 'venue',
    component: Venue
  }

];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
