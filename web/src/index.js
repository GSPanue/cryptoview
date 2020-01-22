import Vue from 'vue';
import VueRouter from 'vue-router';
import {
  Row,
  Col,
  Card,
  Table,
  TableColumn
} from 'element-ui';

import App from '@/App';
import store from '@/store';
import routes from '@/router';

import BaseChart from '@/components/BaseChart/Index';
import Chart from '@/components/Chart/Index';
import CryptoTable from '@/components/Table/Index';

Vue.use(VueRouter);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);

Vue.component('base-chart', BaseChart);
Vue.component('chart', Chart);
Vue.component('crypto-table', CryptoTable);

export default new Vue({
  store,
  el: '#app',
  components: { App },
  router: new VueRouter({ mode: 'history', routes }),
  template: '<App/>'
});
