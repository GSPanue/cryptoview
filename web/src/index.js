import Vue from 'vue';
import VueRouter from 'vue-router';

import App from '@/App';
import store from '@/store';
import routes from '@/router';

Vue.use(VueRouter);

export default new Vue({
  store,
  el: '#app',
  components: { App },
  router: new VueRouter({ mode: 'history', routes }),
  template: '<App/>'
});
