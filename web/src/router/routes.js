import Home from '@/views/Home/Index';
import FourOhFour from '@/views/FourOhFour/Index';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '*',
    component: FourOhFour
  }
];

export default routes;
