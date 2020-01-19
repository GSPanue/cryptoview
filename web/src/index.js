import Vue from 'vue';
import VueRouter from 'vue-router';

import App from '@/App';
import routes from '@/router';

Vue.use(VueRouter);

export default new Vue({
  el: '#app',
  components: { App },
  router: new VueRouter({ mode: 'history', routes }),
  template: '<App/>'
});
