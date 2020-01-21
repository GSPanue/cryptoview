import Vue from 'vue';
import VueRouter from 'vue-router';
import { Row, Col, Card, Button } from 'element-ui';

import App from '@/App';
import store from '@/store';
import routes from '@/router';

import BaseChart from '@/components/BaseChart/Index';
import Chart from '@/components/Chart/Index';

Vue.use(VueRouter);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Button);

Vue.component('base-chart', BaseChart);
Vue.component('chart', Chart);

export default new Vue({
  store,
  el: '#app',
  components: { App },
  router: new VueRouter({ mode: 'history', routes }),
  template: '<App/>'
});
