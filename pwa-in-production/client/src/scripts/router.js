import VueRouter from 'vue-router';
import App from './components/App.vue';
import Home from './components/Home.vue';
import Cryptocurrency from './components/Cryptocurrency.vue';
import Weather from './components/Weather.vue';
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';
import SignOut from './components/SignOut.vue';
import NotFound from './components/NotFound.vue';
import Guard from './guard';

// Define some routes
const routes = [
  { path: '/',
    component: App,
    children: [
      { path: '',
        component: Home,
        children: [
          { path: '', name: 'home', component: Cryptocurrency },
          { path: 'weather', name: 'weather', component: Weather }
        ]
      },
      { path: 'sign-in', name: 'signIn', component: SignIn },
      { path: 'sign-up', name: 'signUp', component: SignUp },
      { path: 'sign-out', name: 'signOut', component: SignOut }
    ]
  },
  { path: '/404', name: 'notFound', component: NotFound }
];

// Create the router instance and pass the `routes` option
const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
});

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  console.log(to.path);
  if (!to.matched.length) {
    return next({ name: 'notFound' });
  }

  const publicPages = ['/sign-in', '/sign-up', '/404'];
  const authRequired = !publicPages.includes(to.path);
  const isAuthenticated = await Guard.isAuthenticated();
  // If page required authenticate but user is not authenticated
  if (authRequired && !isAuthenticated) {
    return next({ name: 'signIn' });
  }

  return next();
});

export default router;
