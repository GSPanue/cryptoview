import Vue from 'vue';
import VueRouter from 'vue-router';
import { Row } from 'element-ui';

import App from '@/App';
import store from '@/store';
import routes from '@/router';

import Chart from '@/components/Chart/Index';

Vue.use(VueRouter);
Vue.use(Row);

Vue.component('chart', Chart);

export default new Vue({
  store,
  el: '#app',
  components: { App },
  router: new VueRouter({ mode: 'history', routes }),
  template: '<App/>'
});
