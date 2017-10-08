import './css/master.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import App from './App.vue';

import store from './store/store.js';

Vue.use(VueRouter);
Vue.use(VueAxios, axios);

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');